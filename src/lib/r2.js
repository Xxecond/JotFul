import AWS from "aws-sdk";

const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT, // e.g., https://<account_id>.r2.cloudflarestorage.com
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  region: "auto",
  signatureVersion: "v4",
});

export const uploadToR2 = async (filename, buffer, contentType) => {
  const params = {
    Bucket: process.env.R2_BUCKET,
    Key: filename,
    Body: buffer,
    ContentType: contentType,
  };

  const data = await s3.upload(params).promise();
  return data.Location; // URL to store in MongoDB
};
