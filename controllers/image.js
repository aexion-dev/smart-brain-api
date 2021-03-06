const clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '158d5dbd1b4c47aa923d7b8659121a88'
});

const handleAPICall = (req, res) => {
  app.models
    .predict("a403429f2ddf4b49b307e318f00e528b", req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'));
}

const handleImage = (req, res, db) => {
  const id  = req.body.id;
  const count = req.body.count;

  db('users').where('id', '=', id)
  .increment('entries', count)
  .returning('entries')
  .then(entries => {
    res.json(entries[0])
  })
  .catch(err => res.status(400).json('Unable to get entries'));
}

module.exports = {
  handleImage,
  handleAPICall
}
