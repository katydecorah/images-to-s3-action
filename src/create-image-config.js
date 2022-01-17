const { extname } = require("path");
const { readdir } = require("fs/promises");
const { setFailed } = require("@actions/core");

async function createImageConfig(staging) {
  try {
    const files = await readdir(staging);
    return files.reduce((obj, file) => {
      const ext = extname(file);
      const slug = file.replace(ext, "");
      if (ext === ".png" || ext === ".jpg") {
        obj[slug] = {
          basename: `${file}`,
          sizes: [{ width: 1000 }, { width: 1600 }],
        };
      }
      return obj;
    }, {});
  } catch (error) {
    setFailed(error.message);
  }
}

module.exports = { createImageConfig };
