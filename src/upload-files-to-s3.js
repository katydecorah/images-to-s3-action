"use strict";
const { readdir } = require("fs/promises");
const { createReadStream } = require("fs");
const { putToS3 } = require("./put-to-s3.js");
const { setFailed } = require("@actions/core");

async function uploadFilesToS3(destination) {
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

module.exports = {
  uploadFilesToS3,
};
