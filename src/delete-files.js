"use strict";
const { readdir, unlink } = require("fs/promises");
const { join } = require("path");
const { info, setFailed } = require("@actions/core");

async function deleteFiles(destination) {
  try {
    const files = await readdir(destination);
    for (const file of files) {
      await unlink(join(destination, file));
      info(`🗑 Removed ${file} from ${destination}`);
    }
  } catch (err) {
    setFailed(err);
  }
}

module.exports = {
  deleteFiles,
};
