import express, { ErrorRequestHandler } from "express";
import router from "./routes/index";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import Socket from "./util/socket";

const app = express();
const httpServer = createServer(app);
app.set("port", 8070);

mongoose.connect("mongodb://localhost:27017/Ocloset");

mongoose.connection.on("connected", () => {
  console.log("DB connect success");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("images"));

// socket 파일에 객체 전달
Socket(httpServer);

app.get("/welcome", (_req, res) => {
  res.send("welcome!");
});

// dev route
app.use("/api", router);

// 에러 핸들러
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
};
app.use(errorHandler);

export default app;
