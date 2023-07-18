const express = require("express");
const app = express();
const port = 3000;
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const router = require("./routes"); //不特別設定index.js，就自動搜尋檔名為index的檔案
const bodyParser = require("body-parser"); // 引用 body-parser
require("./config/mongoose");
app.use(bodyParser.urlencoded({ extended: true })); // app.use每一筆請求都需透過body-parser進行前置處理
app.use(methodOverride("_method")); // methodOverride可使用RESTful/PUT/DELETE
//views engine/ static------------------------------------
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(router);
//---------------------------------------------------------
app.listen(port, () => {
  console.log(`this is server on localhost:${port}`);
});
