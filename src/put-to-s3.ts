import { S3 } from "@aws-sdk/client-s3";
import { info } from "@actions/core";
import { ReadStream } from "fs";

export async function putToS3(Key: string, Body: ReadStream): Promise<void> {
  const client = new S3({
    region: process.env.AWS_REGION,
  });
  try {
    await client.putObject({
      Bucket: process.env.AWS_BUCKET,
      Key,
      Body,
      ContentEncoding: "base64",
    });
    info(`⬆️ Uploaded ${Key} to S3.`);
  } catch (error) {
    throw new Error(error.message);
  }
}
