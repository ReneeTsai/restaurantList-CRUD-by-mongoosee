const mongoose = require("mongoose");
const Restaurant = require("../restaurant");
const restaurantList = require("../../restaurant.json").results;
mongoose.connect(
  "mongodb+srv://juoruel:juoruel509010@cluster0.sqndv9x.mongodb.net/restaurant-list?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error!");
});
db.once("open", () => {
  console.log("mongodb connected!");
  Restaurant.create(restaurantList)
    .then(() => {
      console.log("done");
      db.close();
    })
    .catch((e) => console.log(e));
});
