import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET || "mysecret",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "10d",
  S3_ACCESS_KEY: youraccesskey,
  S3_SECRET_ACCESS_KEY: yoursecretaccesskey,
  S3_BUCKET_NAME: yourbucketname,
  S3_REGION: yourregion,
};

export default config;
