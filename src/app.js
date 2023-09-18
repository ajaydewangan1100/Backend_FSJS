// bring
import express, { application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// assign
const app = express();

// we need to configure express for - accept and use data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// export
export default app;
