import express from "express";

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

export default app;
