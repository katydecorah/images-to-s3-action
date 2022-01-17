"use strict";

const { createImageConfig } = require("../create-image-config.js");

jest.mock("@actions/core");

jest.mock("fs/promises", () => {
  return {
    readdir: jest.fn(() => ["my-file.png", "my-other-file.jpg"]),
  };
});

describe("createImageConfig", () => {
  test("works", async () => {
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
});
