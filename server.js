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

//routes
routers.forEach(({ path, middlewares }) => {
  app.use(path, ...middlewares);
});

// server ep
app.get("/", (req, res, next) => {
  res.json({
    status: success,
    message: "Server running smoothly",
  });
});

// 404 not found error
app.use((req, res, next) => {
  next({
    status: 404,
    message: "404 Not Found",
  });
});

//global error
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    status: "error",
    message: error.message,
  });
});

const PORT = process.env.PORT || 8000;

//initialise server
app.listen(PORT, (error) =>
  error
    ? console.log(error)
    : console.log(`Server running at http://localhost:${PORT}`)
);
