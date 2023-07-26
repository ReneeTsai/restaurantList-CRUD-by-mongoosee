const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurant");

router.get("/", (req, res) => {
  const userId = req.user._id;
  Restaurant.find({ userId })
    .lean()
    .then((restaurantsData) => res.render("index", { restaurantsData }))
    .catch((e) => console.log(e));
});

module.exports = router;
