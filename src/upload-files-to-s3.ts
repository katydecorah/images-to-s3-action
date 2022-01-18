import { readdir } from "fs/promises";
import { createReadStream } from "fs";
import { putToS3 } from "./put-to-s3.js";
import { setFailed } from "@actions/core";

export async function uploadFilesToS3(destination: string): Promise<void> {
  try {
    const files = await readdir(destination);

    const formatted = files.map((file) => ({
      path: `${destination}${file}`,
      name: file.replace("-1000", "@1000").replace("-1600", "@1600"),
    }));

    for (const { name, path } of formatted) {
      const body = createReadStream(path);
      await putToS3(name, body);
    }
  } catch (error) {
    setFailed(error.message);
  }
}
