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
  SMTP_MAIL_HOST: process.env.SMTP_MAIL_HOST,
  SMTP_MAIL_PORT: process.env.SMTP_MAIL_PORT,
  SMTP_MAIL_USERNAME: process.env.SMTP_MAIL_USERNAME,
  SMTP_MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD,
  SMTP_SENDER_EMAIL: process.env.SMTP_SENDER_EMAIL,
};

export default config;
