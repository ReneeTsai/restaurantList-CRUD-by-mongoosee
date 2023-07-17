const express = require("express");
const app = express();
const port = 3000;
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const Restaurant = require("./models/restaurant");
// 引用 body-parser
const bodyParser = require("body-parser");
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }));
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
//views engine/ static------------------------------------
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
//---------------------------------------------------------
//瀏覽預設全部餐廳
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurantsData) => res.render("index", { restaurantsData }))
    .catch((e) => console.log(e));
});
//增加餐廳頁面+新增資料庫
app.get("/restaurants/new", (req, res) => {
  return res.render("new");
});
app.post("/restaurants", (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect("/")) // 新增完成後導回首頁
    .catch((e) => console.log(e));
});
//瀏覽特定餐廳詳細內容
app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .lean()
    .then((restaurantData) => res.render("show", { restaurantData }))
    .catch((e) => console.log(e));
});
//更改餐廳頁面+更改資料庫
app.get("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id;

  Restaurant.findById(id)
    .lean()
    .then((restaurantData) => res.render("edit", { restaurantData }))
    .catch((e) => console.log(e));
});
app.post("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((e) => console.log(e));
});
//刪除
app.post("/restaurants/:id/delete", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => {
      res.redirect("/");
    })
    .catch((e) => console.log(e));
});
// 搜尋特定餐廳
app.get("/search", (req, res) => {
  if (req.query.keywords.length === 0) {
    res.redirect("/");
  }
  if (!req.query.keywords) {
    res.redirect("/");
  }
  const keywords = req.query.keywords;
  const keyword = req.query.keywords.trim().toLowerCase();

  Restaurant.find()
    .lean()
    .then((restaurantsData) => {
      const filterRestaurantsData = restaurantsData.filter(
        (data) => data.name.toLowerCase().includes(keyword) || data.category.includes(keyword)
      );
      res.render("index", { restaurantsData: filterRestaurantsData, keywords });
    })
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`this is server on localhost:${port}`);
});
