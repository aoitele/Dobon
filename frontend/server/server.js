"use strict";
const express = require("express");
const serveStatic = require('serve-static');
const app = express();

app.use(serveStatic("./dist"));

const PORT = process.env.PORT || 3000;
app.listen(PORT);

const HOST = (process.env === 'production') ? 'ymltest.herokuapp.com': 'localhost';
console.log(`running on http://${HOST}:${PORT}`);
