"use strict";
const { readdir, unlink, stat } = require("fs/promises");
const { join } = require("path");
const { info, setFailed } = require("@actions/core");

async function deleteFiles(path) {
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

module.exports = {
  deleteFiles,
};
