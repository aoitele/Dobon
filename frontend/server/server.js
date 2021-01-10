"use strict";
const express = require("express");
const app = express();

const PORT = 3000;
const HOST = "localhost";

app.listen(PORT);
console.log(`running on http://${HOST}:${PORT}`);
