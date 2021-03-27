import prisma from '../prisma/main'
import express from "express";
const router: express.Router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello Router");
});

router.get('/prisma', async (req: express.Request, res: express.Response) => {
  const userData = await prisma()
  res.json(userData)
})

router.get("/login", (req: express.Request, res: express.Response) => {
  const result = {
    success: true,
    userId: 1
  };
  res.json(result);
});
router.get("/logout", (req: express.Request, res: express.Response) => {});
router.get("/create", (req: express.Request, res: express.Response) => {});
router.get("/room", (req: express.Request, res: express.Response) => {
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
router.get("/room/:id", (req: express.Request, res: express.Response) => {
  res.send("this room number is" + req.params.id);
});

export default router
