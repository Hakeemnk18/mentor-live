import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { env } from "../config/env.js";

const app = express();

const allowedOrigins = (env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""));

app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
