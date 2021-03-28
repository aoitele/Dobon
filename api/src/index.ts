import express from "express";
import cors from "cors";
import router from "./routes/index";

const app: express.Express = express();

app.use(cors({
  origin: process.env.ALLOW_ORIGIN,
  optionsSuccessStatus: 200
}));

app.use("/", router);

const PORT = process.env.PORT || 8080;
const HOST = process.env.NODE_ENV === "production" ? "https://dobon-api.herokuapp.com" : "http://localhost"; // prettier-ignore

app.listen(PORT);
console.log(`running on ${HOST}:${PORT}`);
