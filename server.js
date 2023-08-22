const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/ranking_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Rank = mongoose.model('Rank', {
  username: String,
  time: Number,
});

app.post('/submit', (req, res) => {
  const { username, time } = req.body;
  
  if (!username || !time) {
    return res.status(400).json({ error: 'Username and time are required' });
  }
  
  const rank = new Rank({ username, time });
  rank.save()
    .then(() => {
      res.json({ message: 'Data saved successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});