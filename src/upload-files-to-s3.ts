import { readdir } from "fs/promises";
import { createReadStream, ReadStream } from "fs";
import { putToS3 } from "./put-to-s3.js";
import { setFailed } from "@actions/core";

export async function uploadFilesToS3(destination: string): Promise<void> {
  try {
    const files = await readdir(destination);

    const formatted = files.map((file) => ({
      path: `${destination}${file}`,
      name: file.replace("-1000", "@1000").replace("-1600", "@1600"),
    }));

    for (const file of formatted) {
      const body = createReadStream(file.path);
      await putToS3(file.name, body);
    }
  } catch (err) {
    setFailed("Could not copy");
  }
}
