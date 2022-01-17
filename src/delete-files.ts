import { readdir, unlink, stat } from "fs/promises";
import { join } from "path";
import { info, setFailed } from "@actions/core";

export async function deleteFiles(path) {
  try {
    const files = await readdir(path);
    for (const file of files) {
      const fstat = await stat(join(path, file));
      if (!fstat.isDirectory()) {
        await unlink(join(path, file));
        info(`🗑 Removed ${file} from ${path}`);
      }
    }
  } catch (err) {
    setFailed(err);
  }
}
