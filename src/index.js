import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/index.js";

// there are 2 methods for doing mongoose connection -->
// 1. using promises ->
// mongoose.connect('mongodb://127.0.0.1:27017/test').
//   catch(error => handleError(error));

// 2. using try-catch and async-await
(async () => {
  try {
    // connection string put here
    console.log(config.MONGO_URL);
    await mongoose.connect(config.MONGO_URL);
    console.log("DB CONNECTED");

    // checking connection betweeen express and DB
    app.on("error", (err) => {
      console.log("ERROR: ", err);
      throw err;
    });

    // listening here
    const onListening = () => {
      console.log("Listening on port ", process.env.PORT);
    };

    app.listen(process.env.PORT, onListening);
  } catch (err) {
    console.error("ERROR: ", err);
    throw err;
  }
})();
