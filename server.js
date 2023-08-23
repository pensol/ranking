const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); 
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Atlas接続URI
const uri = 'mongodb+srv://masahito:hirakegoma@ranking.jboipmw.mongodb.net/?retryWrites=true&w=majority';
//mongodb+srv://masahito:<password>@ranking.jboipmw.mongodb.net/?retryWrites=true&w=majority

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlasに接続しました'))
  .catch(err => console.error('MongoDB Atlasへの接続エラー:', err));

// モデルの定義
const DataSchema = new mongoose.Schema({
  username: String,
  time: String
});

const Data = mongoose.model('Data', DataSchema , 'ranking');

// POSTリクエストを処理するエンドポイント
app.post('/saveData', async (req, res) => {
  const { username, time } = req.body;
  const data = new Data({ username, time });

  try {
    await data.save();
    console.log('データが保存されました');
    res.send('データが保存されました');
  } catch (err) {
    console.error('データ保存エラー:', err);
    res.status(500).send('エラーが発生しました');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});