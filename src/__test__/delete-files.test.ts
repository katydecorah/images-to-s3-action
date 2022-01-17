import { deleteFiles } from "../delete-files";
import { info } from "@actions/core";
import { unlink, stat } from "fs/promises";

jest.mock("@actions/core");
jest.mock("fs/promises", () => {
  return {
    readdir: jest.fn(() => ["my-file.png", "my-other-file.png"]),
    unlink: jest.fn(),
    stat: jest.fn().mockImplementation(() => {
      return { isDirectory: () => false };
    }),
  };
});

describe("deleteFiles", () => {
  test("works", async () => {
    await deleteFiles("./src/");
    expect(stat).toHaveBeenNthCalledWith(1, "src/my-file.png");
    expect(unlink).toHaveBeenNthCalledWith(1, "src/my-file.png");
    expect(info).toHaveBeenNthCalledWith(
      1,
      `🗑 Removed my-file.png from ./src/`
    );
    expect(stat).toHaveBeenNthCalledWith(2, "src/my-other-file.png");
    expect(unlink).toHaveBeenNthCalledWith(2, "src/my-other-file.png");
    expect(info).toHaveBeenNthCalledWith(
      2,
      `🗑 Removed my-other-file.png from ./src/`
    );
  });
});
