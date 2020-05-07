const redisClient = require('./signin').redisClient;

const handleSignOut = (db, bcrypt) => (req, res) => {
  const { token } = req.body
  return Promise.resolve(redisClient.del(token))
    .catch(err => Promise.reject('unable to remove user auth token'))
}

module.exports = {
  handleSignOut
}
