import { setFailed, info } from "@actions/core";
import { copyFile } from "fs/promises";
import { ImageConfig } from "./index.js";

export async function copyOriginalFiles(
  myImageConfig: ImageConfig,
  inputDirectory: string,
  outputDirectory: string
) {
  const imgArray = Object.keys(myImageConfig).reduce(
    (arr, file) => [...arr, myImageConfig[file].basename],
    []
  );
  try {
    for (const path of imgArray) {
      await copyFile(`${inputDirectory}${path}`, `${outputDirectory}${path}`);
    }
    info(`📠 Copied ${imgArray.length} original files to ${outputDirectory}`);
  } catch (error) {
    setFailed(error.message);
  }
}
