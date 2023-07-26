const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
//需要去尋找資料庫
const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = (app) => {
  // 初始化 Passport 模組
  // 連結passport.session與express-session連結
  app.use(passport.initialize());
  app.use(passport.session());
  // 設定本地登入策略，以email當驗證
  // 1. 是否註冊
  // 2. 密碼/確認密碼是否一樣
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "That email is not registered!" });
          }
          return bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
              return done(null, false, { message: "Email or Password incorrect." });
            }
            return done(null, user);
          });
        })
        .catch((err) => done(err, false));
    })
  );
  // 設定序列化與反序列化
  // (serialize)：登入驗證通過，就把 user id 放進 session
  // (deserialize)：用 user id 去資料庫裡呼叫完整的 user 資料
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};
