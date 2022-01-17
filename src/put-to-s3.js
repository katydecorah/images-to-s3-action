import { S3 } from "@aws-sdk/client-s3";
import { info } from "@actions/core";

export async function putToS3(Key, Body) {
  const client = new S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  try {
    await client.putObject({
      Bucket: process.env.AWS_BUCKET,
      Key,
      Body,
      ContentEncoding: "base64",
    });
    info(`Uploaded ${Key} to S3.`);
  } catch (error) {
    throw new Error(error.message);
  }
}
