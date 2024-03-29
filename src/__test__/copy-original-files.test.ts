import { copyOriginalFiles } from "../copy-original-files";
import { copyFile } from "fs/promises";
import { promises } from "fs";
import { info, setFailed } from "@actions/core";

jest.mock("@actions/core");

const myConfig = {
  "my-file": {
    basename: "my-file.png",
    sizes: [{ width: 1000 }, { width: 1600 }],
  },
  "my-other-file": {
    basename: "my-other-file.jpg",
    sizes: [{ width: 1000 }, { width: 1600 }],
  },
};

describe("copyOriginalFiles", () => {
  test("works", async () => {
    jest.spyOn(promises, "copyFile").mockImplementation();
    await copyOriginalFiles(myConfig, "lib/", "dest/");
    expect(copyFile).toHaveBeenNthCalledWith(
      1,
      "lib/my-file.png",
      "dest/my-file.png"
    );
    expect(copyFile).toHaveBeenNthCalledWith(
      2,
      "lib/my-other-file.jpg",
      "dest/my-other-file.jpg"
    );
    expect(info).toHaveBeenCalledWith("📠 Copied 2 original files to dest/");
  });
  test("error", async () => {
    jest.spyOn(promises, "copyFile").mockRejectedValue({ message: "Error" });
    await copyOriginalFiles(myConfig, "lib/", "dest/");
    expect(setFailed).toHaveBeenCalledWith("Error");
  });
});
