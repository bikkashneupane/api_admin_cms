import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

//middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const PORT = process.env.PORT || 8000;

//initialise server
app.listen(PORT, (error) =>
  error
    ? console.log(error)
    : console.log(`Server runnig at http://localhost:${PORT}`)
);
