"use strict";

const core = require("@actions/core");
const appropriateImages = require("@mapbox/appropriate-images");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const { putToS3 } = require("./put-to-s3.js");
const { deleteFiles } = require("./delete-files.js");

function action() {
  try {
    const staging = core.getInput("image_path");
    const destination = `${core.getInput("image_path")}ready/`;

    rimraf(destination, function () {
      console.log(`🗑\tCleared out ${destination}`);
    });

    const folder = fs.existsSync(staging);
    if (!folder) {
      console.log(`📭\tNo files found in ${staging}`);
      return;
    }

    const myImageConfig = fs.readdirSync(staging).reduce((obj, file) => {
      const ext = path.extname(file);
      const slug = file.replace(ext, "");
      if (ext === ".png" || ext === ".jpg") {
        obj[slug] = {
          basename: `${file}`,
          sizes: [{ width: 1000 }, { width: 1600 }],
        };
      }
      return obj;
    }, {});

    appropriateImages
      .generate(myImageConfig, {
        inputDirectory: staging,
        outputDirectory: destination,
      })
      .then((output) => {
        console.log("⚙️\tGenerated all these images:");
        console.log(output.join("\n"));
      })
      .then(() => {
        // copy over original files
        Object.keys(myImageConfig).forEach((file) => {
          const path = myImageConfig[file].basename;
          fs.copyFileSync(`${staging}${path}`, `${destination}${path}`);
        });
        console.log(`📠\tCopied original files to ${destination}`);
      })
      .then(() => {
        // upload to S3
        const files = fs.readdirSync(destination).reduce((arr, file) => {
          arr.push({
            path: `${destination}${file}`,
            file: file.replace("-1000", "@1000").replace("-1600", "@1600"),
          });
          return arr;
        }, []);
        return Promise.all(
          files.map(async (file) => {
            const body = fs.createReadStream(file.path);
            return await putToS3(file.file, body);
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
    core.setFailed(error.message);
  }
}

module.exports = action();
