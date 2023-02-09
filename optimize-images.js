const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputFolders = [
  "static/images/dzwon2022",
  "static/images/dorsz2022",
  "static/images/dzwon2021",
  "static/images/dzwon2020",
  "static/images/misc",
];

inputFolders.forEach((inputFolder) => {
  fs.readdir(inputFolder, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (file.indexOf("-thumb") > 0) {
        return;
      }

      if (![".jpg", ".jpeg", ".png"].includes(path.extname(filePath))) {
        return;
      }

      if (fs.existsSync(`${file}.webp`)) {
        return;
      }

      const inputFile = path.join(inputFolder, file);
      const outputFile = path.join(inputFolder, file.split(".")[0] + ".webp");

      const outputFileThumb = path.join(
        inputFolder,
        file.split(".")[0] + "-thumb.webp"
      );

      sharp(inputFile)
        .resize({ width: size }) // resize to the specified width
        .webp({ quality: 80 }) // set WebP quality to 80
        .toFile(outputFile)
        .then((info) => {
          console.log(`Image ${file} was optimized`);
        })
        .catch((err) => {
          console.log(`An error occured while processing ${file}: ${err}`);
        });

      sharp(inputFile)
        .resize({ width: 700, height: 700, fit: "inside" })
        .webp({ quality: 80 }) // set WebP quality to 80
        .toFile(outputFileThumb)
        .then((info) => {
          console.log(`Image ${file} was resized and optimized`);
        })
        .catch((err) => {
          console.log(`An error occured while processing ${file}: ${err}`);
        });
    });
  });
});
