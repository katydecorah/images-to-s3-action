"use strict";

const { getInput, setFailed, info } = require("@actions/core");
const appropriateImages = require("@mapbox/appropriate-images");
const {
  readdirSync,
  createReadStream,
  existsSync,
  copyFileSync,
} = require("fs");
const rimraf = require("rimraf");
const { putToS3 } = require("./put-to-s3.js");
const { deleteFiles } = require("./delete-files.js");
const { createImageConfig } = require("./create-image-config.js");

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

    const myImageConfig = await createImageConfig(staging);

    appropriateImages
      .generate(myImageConfig, {
        inputDirectory: staging,
        outputDirectory: destination,
      })
      .then((output) => {
        info("⚙️\tGenerated all these images:");
        info(output.join("\n"));
      })
      .then(() => {
        // copy over original files
        Object.keys(myImageConfig).forEach((file) => {
          const path = myImageConfig[file].basename;
          copyFileSync(`${staging}${path}`, `${destination}${path}`);
        });
        info(`📠\tCopied original files to ${destination}`);
      })
      .then(() => {
        // upload to S3
        const files = readdirSync(destination).map((file) => ({
          path: `${destination}${file}`,
          name: file.replace("-1000", "@1000").replace("-1600", "@1600"),
        }));
        return Promise.all(
          files.map(async ({ path, name }) => {
            const body = createReadStream(path);
            return await putToS3(name, body);
          })
        );
      })
      .then(() => deleteFiles(staging)) // delete files in staging
      .then(() => deleteFiles(destination)) // delete files in destination
      .catch((errors) => {
        if (Array.isArray(errors)) {
          errors.forEach((err) => console.error(err.stack));
        } else {
          console.error(errors.stack);
        }
      });
  } catch (error) {
    setFailed(error.message);
  }
}

module.exports = action();
