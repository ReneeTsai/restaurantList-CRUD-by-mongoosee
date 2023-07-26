const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurant");

//增加餐廳頁面+新增資料庫
router.get("/new", (req, res) => {
  return res.render("new");
});
router.post("/", (req, res) => {
  const userId = req.user._id;
  const restaurantInfo = req.body;
  Restaurant.create({ ...restaurantInfo, userId })
    .then(() => res.redirect("/")) // 新增完成後導回首頁
    .catch((e) => console.log(e));
});
//瀏覽特定餐廳詳細內容
router.get("/:id", (req, res) => {
  const _id = req.params.id;
  const userId = req.user._id;
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurantData) => res.render("show", { restaurantData }))
    .catch((e) => console.log(e));
});
//更改餐廳頁面+更改資料庫
router.get("/:id/edit", (req, res) => {
  const _id = req.params.id;
  const userId = req.user._id;
  Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurantData) => res.render("edit", { restaurantData }))
    .catch((e) => console.log(e));
});
router.put("/:id", (req, res) => {
  const _id = req.params.id;
  const userId = req.user._id;
  const { name, name_en, category, rating, description, google_map, phone, location, image } =
    req.body;
  return (
    Restaurant.findOneAndUpdate(
      { _id, userId },
      {
        name,
        name_en,
        category,
        rating,
        description,
        google_map,
        phone,
        location,
        image,
      },
      { new: true }
    )
      // 將這個選項設置為 true，讓更新後的資料返回)
      .then((updatedRestaurant) => res.redirect(`/restaurants/${updatedRestaurant._id}`))
      .catch((e) => console.log(e))
  );
});
//刪除
router.delete("/:id", (req, res) => {
  const _id = req.params.id;
  const userId = req.user._id;
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => restaurant.remove())
    .then(() => {
      res.redirect("/");
    })
    .catch((e) => console.log(e));
});

module.exports = router;
