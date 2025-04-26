import express from "express";
import { config } from "dotenv"; // dotenv pkg ko download karni ke bad import keya ke hm secret file ko .env men rakh sakhe
import cors from "cors"; // frontend ke URL ko read karni ke lei hm cors ka istemal karte hen
import cookieParser from "cookie-parser"; // apni cookies ko store karni ke lei
import fileUpload from "express-fileupload"; // image ya Avatar ko send karni ke lei
import database from "./DetaBase/dataBase.js"; // database
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middlewere/errorMiddlewere.js"; // error mmiddlewere matlb ye response and req ke bech men kam karega
import userRouter from "./router/userRouter.js";
import appointment from "./router/appointmentRouter.js";

const app = express();
config({ path: "./Config/config.env" });

app.use(
  cors({
    origin: [
      "https://kmb-f4qg.vercel.app/",
      "https://dashboard-kmb.vercel.app/login",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"], //PUT update karni ke lei
    credentials: true, //  credentials:true  acception to comunicate frontend and Backend
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// app.get("/", (req, res) => {
//   res.send("✅ Backend API is running on Railway successfully!");
// });

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointment);

database();

app.use(errorMiddleware);
export default app;
