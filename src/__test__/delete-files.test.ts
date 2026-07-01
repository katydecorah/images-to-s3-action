import { deleteFiles } from "../delete-files";
import { info, setFailed } from "@actions/core";
import { unlink, stat } from "fs/promises";
import { promises } from "fs";

jest.mock("@actions/core");

describe("deleteFiles", () => {
  test("works", async () => {
    jest
      .spyOn(promises, "readdir")
      .mockResolvedValue(["my-file.png", "my-other-file.jpg"] as any);
    jest.spyOn(promises, "unlink").mockImplementation();
    jest
      .spyOn(promises, "stat")
      .mockResolvedValue({ isDirectory: () => false } as any);
    await deleteFiles("./src/");
    expect(stat).toHaveBeenNthCalledWith(1, "src/my-file.png");
    expect(unlink).toHaveBeenNthCalledWith(1, "src/my-file.png");
    expect(info).toHaveBeenNthCalledWith(
      1,
      `🗑 Removed my-file.png from ./src/`,
    );
    expect(stat).toHaveBeenNthCalledWith(2, "src/my-other-file.jpg");
    expect(unlink).toHaveBeenNthCalledWith(2, "src/my-other-file.jpg");
    expect(info).toHaveBeenNthCalledWith(
      2,
      `🗑 Removed my-other-file.jpg from ./src/`,
    );
  });

  test("skip directories", async () => {
    jest
      .spyOn(promises, "readdir")
      .mockResolvedValue(["my-files/", "my-other-files/"] as any);
    jest.spyOn(promises, "unlink").mockImplementation();
    jest
      .spyOn(promises, "stat")
      .mockResolvedValue({ isDirectory: () => true } as any);
    await deleteFiles("./src/");
    expect(stat).toHaveBeenNthCalledWith(1, "src/my-files/");
    expect(unlink).not.toHaveBeenCalled();
    expect(info).not.toHaveBeenCalled();
    expect(stat).toHaveBeenNthCalledWith(2, "src/my-other-files/");
  });

  test("error", async () => {
    jest
      .spyOn(promises, "readdir")
      .mockResolvedValue(["my-file.png", "my-other-file.jpg"] as any);
    jest.spyOn(promises, "unlink").mockImplementation();
    jest.spyOn(promises, "stat").mockRejectedValue({ message: "Error" });
    await deleteFiles("./src/");
    expect(setFailed).toHaveBeenCalledWith("Error");
  });
});
