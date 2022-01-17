import { setFailed, info } from "@actions/core";
import { copyFile } from "fs/promises";

export async function copyOriginalFiles(myImageConfig, staging, destination) {
  const imgArray = Object.keys(myImageConfig).reduce(
    (arr, file) => [...arr, myImageConfig[file].basename],
    []
  );
  try {
    for (const path of imgArray) {
      await copyFile(`${staging}${path}`, `${destination}${path}`);
    }
    info(`📠 Copied ${imgArray.length} original files to ${destination}`);
  } catch (err) {
    setFailed("Could not copy");
  }
}
