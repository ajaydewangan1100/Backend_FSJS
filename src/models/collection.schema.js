import mongoose from "mongoose";

// we can destrucutre schema like 1st or can use like second
// 1st
// import { Schema } from "mongoose";

// 2nd
const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "Please provide a collection name"],
      trim: true,
      maxLength: [120, "Collection name should not be more than 120 chars"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Collection", collectionSchema);

// on DB it will become -> collections (small letter and plural)
