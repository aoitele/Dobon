const express = require("express");
const router = express.Router();
const wrap = fn => (...args) => fn(...args).catch(args[2]);

router.get("/", (req, res) => {
  res.send("Hello Router");
});

router.get("/login", (req, res) => {
  const result = {
    success: true,
    userId: 1
  };
  res.json(result);
});
router.get("/logout", (req, res) => {});
router.get("/create", (req, res) => {});
router.get("/room", (req, res) => {
  // 開催中のルーム一覧を返す
  const roomInfo = [
    {
      id: 1,
      name: "テスト部屋A",
      participantUserId: [1, 2, 3]
    },
    {
      id: 2,
      name: "テスト部屋F",
      participantUserId: [4, 5, 6]
    }
  ];
  res.json(roomInfo);
});
router.get("/room/:id", (req, res) => {
  res.send("this room number is" + req.params.id);
});

module.exports = router;
