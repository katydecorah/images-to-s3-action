"use strict";

const { putToS3 } = require("../put-to-s3.js");
const { info } = require("@actions/core");

jest.mock("@actions/core");

const mockS3 = {
  putObject: jest.fn(),
};

jest.mock("@aws-sdk/client-s3", () => {
  return { S3: jest.fn(() => mockS3) };
});

process.env.AWS_BUCKET = "MY_BUCKET";

describe("putToS3", () => {
  test("works", async () => {
    await putToS3("KEY", "BODY");
    await expect(mockS3.putObject).toHaveBeenCalledWith({
      Body: "BODY",
      Bucket: "MY_BUCKET",
      ContentEncoding: "base64",
      Key: "KEY",
    });
    expect(info).toHaveBeenCalledWith("Uploaded KEY to S3.");
  });
});
