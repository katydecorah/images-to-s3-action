import { setFailed } from "@actions/core";
import { putToS3 } from "../put-to-s3";
import fs, { promises } from "fs";
import { uploadFilesToS3 } from "../upload-files-to-s3";

jest.mock("../put-to-s3");
jest.mock("@actions/core");

describe("uploadFilesToS3", () => {
  test("works", async () => {
    jest
      .spyOn(promises, "readdir")
      .mockResolvedValue(["my-file.png", "my-other-file.jpg"]);
    jest.spyOn(fs, "createReadStream").mockReturnValue("file-stream-body");

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

  test("error", async () => {
    jest.spyOn(promises, "readdir").mockRejectedValue({ message: "Error" });
    await uploadFilesToS3("dest/");
    expect(setFailed).toHaveBeenCalledWith("Error");
  });
});
