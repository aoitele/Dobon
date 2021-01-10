"use strict";
const express = require("express");
const app = express();
const router = require("./router");

app.use("/", router);

const PORT = 8080;
const HOST = "localhost";

app.listen(PORT);
console.log(`running on http://${HOST}:${PORT}`);
