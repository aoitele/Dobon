"use strict";
const express = require("express");
const serveStatic = require('serve-static');
const app = express();

app.use(serveStatic("./dist"));

const PORT = process.env.PORT || 3000;
const HOST = (process.env.NODE_ENV === 'production') ? 'https://ymltest.herokuapp.com': 'http://localhost';
console.log(`running on ${HOST}:${PORT}`);
app.listen(PORT);
