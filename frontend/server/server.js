"use strict";
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = (process.env === 'production') ? 'ymltest.herokuapp.com': 'localhost';

app.listen(PORT);
console.log(`running on http://${HOST}:${PORT}`);
