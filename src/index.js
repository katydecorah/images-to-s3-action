"use strict";

const { getInput, setFailed, info } = require("@actions/core");
const appropriateImages = require("@mapbox/appropriate-images");
const { existsSync } = require("fs");
const rimraf = require("rimraf");
const { deleteFiles } = require("./delete-files.js");
const { createImageConfig } = require("./create-image-config.js");
const { copyOriginalFiles } = require("./copy-original-files.js");
const { uploadFilesToS3 } = require("./upload-files-to-s3.js");

async function action() {
  try {
    const staging = getInput("image_path");
    const destination = `${getInput("image_path")}ready/`;

    rimraf(destination, function () {
      info(`🗑\tCleared out ${destination}`);
    });

    const folder = existsSync(staging);
    if (!folder) {
      info(`📭\tNo files found in ${staging}`);
      return;
    }

    const myImageConfig = await createImageConfig(
      myImageConfig,
      staging,
      destination
    );

    const generatedImages = await appropriateImages.generate(myImageConfig, {
      inputDirectory: staging,
      outputDirectory: destination,
    });

    info("⚙️\tGenerated all these images:");
    info(generatedImages.join("\n"));

    // copy over original files
    await copyOriginalFiles(myImageConfig, staging, destination);

    // upload to S3
    await uploadFilesToS3(destination);

    await deleteFiles(staging); // delete files in staging
    await deleteFiles(destination); // delete files in destination
  } catch (error) {
    setFailed(error.message);
  }
}

module.exports = action();
