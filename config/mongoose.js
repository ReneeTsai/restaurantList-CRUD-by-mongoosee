const mongoose = require("mongoose");

//mongoose connect--------------------------------------
mongoose.connect(
  "mongodb+srv://juoruel:juoruel509010@cluster0.sqndv9x.mongodb.net/restaurant-list?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
// 取得資料庫連線狀態
const db = mongoose.connection;
// 連線異常
db.on("error", () => {
  console.log("mongodb error!");
});
// 連線成功
db.once("open", () => {
  console.log("mongodb connected!");
});

module.exports = db;
