const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const router = require("./routes"); //不特別設定index.js，就自動搜尋檔名為index的檔案
const bodyParser = require("body-parser"); // 引用 body-parser
const session = require("express-session");
const usePassport = require("./config/passport");
const flash = require("connect-flash");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const PORT = process.env.PORT;
require("./config/mongoose");
app.use(bodyParser.urlencoded({ extended: true })); // app.use每一筆請求都需透過body-parser進行前置處理
app.use(methodOverride("_method")); // methodOverride可使用RESTful/PUT/DELETE

//views engine/ static------------------------------------
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");
//cookie-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
//放在router以前
usePassport(app);
app.use(flash());
//在 usePassport(app) 之後、app.use(routes) 之前，加入一組 middleware (用來檢查登入狀態)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});
app.use(router);
//---------------------------------------------------------
app.listen(PORT, () => {
  console.log(`this is server on localhost:${PORT}`);
});
