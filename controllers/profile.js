const handleProfileGet = (req, res, db) => {
  const { id } = req.params;

  db.select('*').from('users').where({id})
    .then(user => {
      (user.length) ? res.json(user[0])
      : res.status(400).json('User Not Found');
    })
    .catch(err => res.status(400).json('error getting user'));
}

module.exports = {
  handleProfileGet
}
