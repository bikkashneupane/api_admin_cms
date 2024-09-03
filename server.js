import express from "express";
import morgan from "morgan";
import cors from "cors";
import { connectMongo } from "./src/config/mongoConfig.js";
import routers from "./src/routes/routers.js";

const app = express();

// connect database
connectMongo();

//middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//routes api(s)
routers.forEach(({ path, middlewares }) => {
  app.use(path, ...middlewares);
});

import filePath from "path";
const _dirname = filePath.resolve();
app.use(express.static(filePath.join(_dirname, "public")));

// server route
app.get("/", (req, res, next) => {
  res.json({
    message: "Server Live...",
  });
});

// 404 error handler
app.use((req, res, next) => {
  next({
    status: 404,
    message: "404 Path Not found",
  });
});

// global error handler
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500).json({
    message: error.message,
  });
});

const PORT = process.env.PORT || 8000;

//initialise server
app.listen(PORT, (error) =>
  error ? console.log(error) : console.log(`Server running at port: ${PORT}`)
);
