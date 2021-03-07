"use strict";
const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router");

app.use(cors());
app.use("/", router);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const PORT = process.env.PORT || 8080;
const HOST = (process.env.NODE_ENV === 'production') ? 'https://ymltest.herokuapp.com': 'http://localhost';

app.listen(PORT);
console.log(`running on http://${HOST}:${PORT}`);
