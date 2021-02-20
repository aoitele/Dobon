const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello Router");
});

router.get("/login", (req, res) => {});
router.get("/logout", (req, res) => {});
router.get("/create", (req, res) => {});
router.get("/room", (req, res) => {});
router.get("/room/:id", (req, res) => {
  res.send("this room number is" + req.params.id);
});

module.exports = router;
