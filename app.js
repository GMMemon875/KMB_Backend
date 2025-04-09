import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import database from "./DetaBase/dataBase.js";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middlewere/errorMiddlewere.js";
import userRouter from "./router/userRouter.js";
import appointment from "./router/appointmentRouter.js";

// App setup
const app = express();

// Load environment variables
config({ path: "./Config/config.env" });

// CORS setup for multiple origins
app.use(
  cors({
    origin: [
      "https://kmb-f4qg.vercel.app", // Replace with your frontend URL
      process.env.FRONTEND_URL_TWO, // Environment variable for second frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allows cookies to be sent
  })
);

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload setup
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // Ensure this works for your production environment
  })
);

// API Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointment);

// Connect to the database
database();

// Error handling middleware
app.use(errorMiddleware);

// Start server
export default app;
