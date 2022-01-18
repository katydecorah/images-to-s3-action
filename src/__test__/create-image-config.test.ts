import { createImageConfig } from "../create-image-config";
import { promises } from "fs";
import { setFailed } from "@actions/core";

jest.mock("@actions/core");

describe("createImageConfig", () => {
  test("works", async () => {
    jest
      .spyOn(promises, "readdir")
      .mockResolvedValue(["my-file.png", "my-other-file.jpg", "my-file.html"]);
    expect(await createImageConfig("./src/")).toEqual({
      "my-file": {
        basename: "my-file.png",
        sizes: [{ width: 1000 }, { width: 1600 }],
      },
      "my-other-file": {
        basename: "my-other-file.jpg",
        sizes: [{ width: 1000 }, { width: 1600 }],
      },
    });
  });
  test("error", async () => {
    jest.spyOn(promises, "readdir").mockRejectedValue({ message: "Error" });
    await createImageConfig("./src/");
    expect(setFailed).toHaveBeenCalledWith("Error");
  });
});
