import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credential: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// route imports
import AuthRouter from "./routes/auth.routes.js";
import FileUploadRouter from "./routes/fileUpload.routes.js";

// routes diclaration
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/file-upload", FileUploadRouter);

export default app;
