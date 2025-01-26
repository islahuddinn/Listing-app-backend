const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadFile = async (file) => {
  const params = {
    Bucket: "gro2go-bucket",
    Key: `grocery2go-app-${Date.now()}-${file.name}`,
    Body: file.data,
  };
  const data = await s3.upload(params).promise();
  return data.Location;
};

module.exports = {
  uploadFile,
};
