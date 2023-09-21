// bring
import express, { application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// importing route for use
import routes from "./routes/index.js";

// assign
const app = express();

// we need to configure express for - accept and use data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// this route definition is always after cors(), cookieparser() and other things done
app.use("api/vi", routes);

// default route
app.get("/", (_req, res) => {
  res.send("Hellow this Api by - Ajay");
});

// handling wild routes (if triggered any route whihc is not defined)
app.use("*", (_req, res) => {
  res.status(404).json({
    succes: false,
    message: "Route not found",
  });
});

// export
export default app;
