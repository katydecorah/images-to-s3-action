import { extname } from "path";
import { readdir } from "fs/promises";
import { setFailed } from "@actions/core";
import { ImageConfig } from "./index.js";

export async function createImageConfig(
  inputDirectory: string
): Promise<ImageConfig | undefined> {
  try {
    const files = await readdir(inputDirectory);
    return files.reduce((obj, file) => {
      const ext = extname(file);
      const slug = file.replace(ext, "");
      if (ext === ".png" || ext === ".jpg") {
        obj[slug] = {
          basename: file,
          sizes: [{ width: 1000 }, { width: 1600 }],
        };
      }
      return obj;
    }, {});
  } catch (error) {
    setFailed(error.message);
  }
}
