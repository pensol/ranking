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
const uri = "mongodb+srv://masahito:hirakegoma@ranking.jboipmw.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlasに接続しました'))
  .catch(err => console.error('MongoDB Atlasへの接続エラー:', err))

// モデルの定義
const DataSchema = new mongoose.Schema({
  username: String,
  description: String,
  club: String,
  time: Number,
  className: String,
});

const Data = mongoose.model('Data', DataSchema, 'ranking');

// POSTリクエストを処理するエンドポイント
app.post('/saveData', async (req, res) => {
  const { username, time, description, club, className } = req.body;
  console.log(req.body);
  const data = new Data({ username, time, description, club, className });
  try {
    await data.save();
    console.log('データが保存されました');
    res.send('データが保存されました');
  } catch (err) {
    console.error('データ保存エラー:', err);
    res.status(500).send('エラーが発生しました');
  }
});

// GETリクエストを処理するエンドポイント
app.get('/getRanking', async (req, res) => {
  try {

    const rankingData = await Data.find().sort({ time: 1 }).limit(7); // タイムの短い順に上位7件を取得

    // HTML形式のランキングを生成
    const rankingHtml = `
    <!DOCTYPE html>
      <html lang="ja">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ランキング</title>
        <link rel="stylesheet" href="/ranking.css">
        </head>
        <body>
          <h1 class="title">ランキング</h1>
          <div class="main" id="particles">
            <div class="container">
              <ul class="ranking-list">
                ${rankingData.map((data, index) => `
                  <li>
                    <div class="ranking-area">
                      <p class="ranking-text">${index + 1}</p>
                    </div>
                    <p class="username">${data.username}</p>
                    <p class="time">${data.time}</p>
                  </li>
            `     ).join('')}
              </ul>
            </div>
            <div class="backWrapper">
              <button class="backdata">
                <a href="/">
                  <p>➡</p>
                  <p>ランキング登録</p></a>
              </button>
            </div>
            <div class="showAlldataWrapper">
              <div class="showAlldata">
                <a href="/alluser">
                  <p>全てのランキング</p>
                  <p>➡</p>
                </a>
              </div>
            </div>
          </div>
          
        </body>
      </html>
    `;

    res.send(rankingHtml);
  } catch (err) {
    console.error('ランキング取得エラー:', err);
    res.status(500).send('エラーが発生しました');
  }
});


app.get("/alluser", async (req, res) => {
  try {

    const basicData = await Data.find().sort({ time: 1 });//timeを早い順から表示 



    // HTML形式のランキンmoグを生成
    const rankingHtml = `
    <!DOCTYPE html>
      <html lang="ja">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ランキング</title>
        <link rel="stylesheet" href="/alluser.css"></link>
        </head>
        <body>
          <h1>全てのランキング</h1>
          <div class="align">
          <div class="nav">
          <p class="nav-item">
            <a href="/getRanking">←上位ランキング</a>
          </p>
          <p class="nav-item">
            <a href="/">ランキング登録 ➡</a>
          </p>
        </div>
        <div class="container">
          <ul class="ranking-list">
            ${basicData.map((data, index) =>
      `
                <li class="ranking-item">
                  <p class="rank">${index + 1}位</p>
                  <p class="username">${data.username}</p>
                  <p class="className">${data.className}</p>
                  <p class="club">${data.club}</p>
                  <p class="time">${data.time}秒</p>
                  <p class="description">${data.description ? `٩(ˊᗜˋ*)و <${data.description}` : ""}</p>
                </li>
                </hr class="hr">
                
              `
    ).join("")}
          </ul>
        </div>
          </div>
        </body>
      </html>
    
      `
    res.send(rankingHtml);

  } catch (error) {
    console.log(error);
    return res.status(500)
  }
})




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});
