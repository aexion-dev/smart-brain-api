const jwt = require('jsonwebtoken');
const redisClient = require('./signin').redisClient;

const handleRegister = (db, bcrypt, req, res) => {
  const { email, name, password } = req.body;

  if(!email || !name || !password) {
    return Promise.reject('incorrect form submission')
  }

  const hash = bcrypt.hashSync(password);
    return db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date(),
          avatar: 'http://tachyons.io/img/logo.jpg'
        })
        .then(user => user[0])
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json(err));
}

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days'});
}

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user) => {
  //JWT token, return user data.
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return {success: 'true', userId: id, token }
    })
    .catch(console.log)
}

const registerAuthentication = (db, bcrypt) => (req, res) => {
  return handleRegister(db, bcrypt, req, res)
      .then(data => {
        console.log(data);
        return data.id && data.email ? createSessions(data) : Promise.reject(data)
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err))
}

module.exports = {
  handleRegister,
  registerAuthentication
}
