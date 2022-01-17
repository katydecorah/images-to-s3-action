import { getInput, setFailed, info } from "@actions/core";
import { generate } from "@mapbox/appropriate-images";
import { existsSync } from "fs";
import rimraf from "rimraf";
import { deleteFiles } from "./delete-files.js";
import { createImageConfig } from "./create-image-config.js";
import { copyOriginalFiles } from "./copy-original-files.js";
import { uploadFilesToS3 } from "./upload-files-to-s3.js";

export type ImageConfig = {
  [id: string]: { basename: string; sizes: { width: number }[] };
};

async function action() {
  try {
    const staging = getInput("image_path");
    const destination = `${getInput("image_path")}ready/`;

    rimraf(destination, () => info(`🗑 Cleared out ${destination}`));

    if (!existsSync(staging)) {
      info(`📭 No files found in ${staging}`);
      return;
    }

    // generate images
    const myImageConfig = (await createImageConfig(staging)) as ImageConfig;
    const generatedImages = await generate(myImageConfig, {
      inputDirectory: staging,
      outputDirectory: destination,
    });
    info("⚙️ Generated all these images:");
    info(generatedImages.join("\n"));
    // copy over original files
    await copyOriginalFiles(myImageConfig, staging, destination);
    // upload to S3
    await uploadFilesToS3(destination);
    // delete files in staging
    await deleteFiles(staging);
    // delete files in destination
    await deleteFiles(destination);
  } catch (error) {
    setFailed(error.message);
  }
}

export default action();
