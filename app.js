const express = require("express");
const expressLayout = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");

const app = express();

const connectDB = require("./modules/config/DB");
connectDB();

//CONFIG
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/uploads"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/modules/views"));
app.use(expressLayout); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "sectretkey",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//ROUTER
const adminRouter = require("./modules/router/admin");
const webRouter = require("./modules/router/web");
app.use("/admin", adminRouter);
app.use("/", webRouter);

app.listen(8800, (err) => {
  if (err) console.log(err);
  console.log("server run on port 8800");
});
