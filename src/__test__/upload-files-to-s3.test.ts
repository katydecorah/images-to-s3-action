import { putToS3 } from "../put-to-s3";
import { uploadFilesToS3 } from "../upload-files-to-s3";

jest.mock("../put-to-s3");
jest.mock("fs", () => {
  return {
    createReadStream: jest.fn(() => "file-stream-body"),
  };
});
jest.mock("@actions/core");
jest.mock("fs/promises", () => {
  return {
    readdir: jest.fn(() => ["my-file.png", "my-other-file.jpg"]),
  };
});

describe("uploadFilesToS3", () => {
  test("works", async () => {
    await uploadFilesToS3("dest/");
    expect(putToS3).toHaveBeenNthCalledWith(
      1,
      "my-file.png",
      "file-stream-body"
    );
    expect(putToS3).toHaveBeenNthCalledWith(
      2,
      "my-other-file.jpg",
      "file-stream-body"
    );
  });
});
