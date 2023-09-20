//
import s3 from "../config/s3.config.js";

// uploading file
export const s3FileUpload = async ({ bucketName, key, body, contentType }) => {
  return await s3
    .upload({
      bucket: bucketName,
      key: key,
      body: body,
      contentType: contentType,
    })
    .promise();
};

// given things under request -
// bucketName - bucket
// key - key or unique id of that image or media file
// body - this is the image or file want to upload
// contentType - like jpeg, png, pdf etc

// deleting uploaded file
export const s3DeleteFile = async ({ bucketName, key }) => {
  return await s3
    .deleteObject({
      bucket: bucketName,
      key: key,
    })
    .promise();
};
