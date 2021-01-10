const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello Router");
});

router.get("/play", (req, res) => {
  res.send("let's play");
});

module.exports = router;
