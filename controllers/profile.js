const handleProfileGet = (req, res, db) => {
  const { id } = req.params;

  db.select('*').from('users').where({id})
    .then(user => {
      (user.length) ? res.json(user[0])
      : res.status(400).json('User Not Found');
    })
    .catch(err => res.status(400).json('error getting user'));
}

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet, avatar } = req.body.formInput;
  db('users')
    .where({ id })
    .update({ name, age, pet, avatar })
    .then(resp => {
      if(resp) {
        res.json('success')
      } else {
        res.status(400).json('Unable to update')
      }
    })
}

module.exports = {
  handleProfileGet,
  handleProfileUpdate
}
