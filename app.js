const express = require("express");
const app = express();
const flash = require("connect-flash");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;


mongoose.connect(process.env.MONGODB_URI).then(console.log("Connected Mongodb"));

const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/index");
const orderRouter = require("./routes/orderRouter");
const accountRouter = require("./routes/accountRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
}))

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(flash());
app.use("/",indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/account", accountRouter);
app.use("/", orderRouter);

app.listen(port); 