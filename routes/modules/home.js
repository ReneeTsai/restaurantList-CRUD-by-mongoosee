const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurant");

router.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurantsData) => res.render("index", { restaurantsData }))
    .catch((e) => console.log(e));
});

module.exports = router;
