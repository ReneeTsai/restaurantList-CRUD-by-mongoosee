const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurant");

//增加餐廳頁面+新增資料庫
router.get("/new", (req, res) => {
  return res.render("new");
});
router.post("/", (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect("/")) // 新增完成後導回首頁
    .catch((e) => console.log(e));
});
//瀏覽特定餐廳詳細內容
router.get("/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .lean()
    .then((restaurantData) => res.render("show", { restaurantData }))
    .catch((e) => console.log(e));
});
//更改餐廳頁面+更改資料庫
router.get("/:id/edit", (req, res) => {
  const id = req.params.id;
  Restaurant.findById(id)
    .lean()
    .then((restaurantData) => res.render("edit", { restaurantData }))
    .catch((e) => console.log(e));
});
router.put("/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((e) => console.log(e));
});
//刪除
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => {
      res.redirect("/");
    })
    .catch((e) => console.log(e));
});

module.exports = router;
