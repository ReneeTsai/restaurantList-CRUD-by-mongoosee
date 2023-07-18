const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurant");

// 搜尋特定餐廳
router.get("/", (req, res) => {
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

module.exports = router;
