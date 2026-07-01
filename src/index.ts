import { getInput, setFailed, info } from "@actions/core";
import { generate } from "@mapbox/appropriate-images";
import { existsSync } from "fs";
import { rm } from "fs/promises";
import { deleteFiles } from "./delete-files.js";
import { createImageConfig } from "./create-image-config.js";
import { copyOriginalFiles } from "./copy-original-files.js";
import { uploadFilesToS3 } from "./upload-files-to-s3.js";

export type ImageConfig = {
  [id: string]: { basename: string; sizes: { width: number }[] };
};

async function action(): Promise<void> {
  try {
    const inputDirectory = getInput("image_path");
    const outputDirectory = `${getInput("image_path")}ready/`;

    await rm(outputDirectory, { recursive: true, force: true });
    info(`🗑 Cleared out ${outputDirectory}`);

    if (!existsSync(inputDirectory)) {
      info(`📭 No files found in ${inputDirectory}`);
      return;
    }

    // generate images
    const myImageConfig = (await createImageConfig(
      inputDirectory,
    )) as ImageConfig;
    const generatedImages = await generate(myImageConfig, {
      inputDirectory,
      outputDirectory,
    });
    info("⚙️ Generated all these images:");
    info(generatedImages.join("\n"));
    // copy over original files
    await copyOriginalFiles(myImageConfig, inputDirectory, outputDirectory);
    // upload to S3
    await uploadFilesToS3(outputDirectory);
    // delete files in inputDirectory
    await deleteFiles(inputDirectory);
    // delete files in outputDirectory
    await deleteFiles(outputDirectory);
  } catch (error) {
    setFailed((error as Error).message);
  }
}

export default action();
