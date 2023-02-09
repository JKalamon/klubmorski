const sharp = require("sharp");
const fs = require('fs-extra')
const path = require("path");

const inputFolders = [
  "static/images/dzwon2022",
  "static/images/dorsz2022",
  "static/images/dzwon2021",
  "static/images/dzwon2020",
  "static/images/misc",
];

const readDirectory = async (dir) => {
  let listOfFiles = [];
  const files = await fs.readdir(dir);  

  // Loop through each file in the directory
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);

    // If the file is a directory, read it recursively
    if (stats.isDirectory()) {
      const folder = await readDirectory(filePath);
      listOfFiles = listOfFiles.concat(...folder);
    } else {
      if (![".jpg", ".jpeg", ".png"].includes(path.extname(filePath))) {
        continue;
      }

      listOfFiles.push(filePath);
    }
  }
  
  return listOfFiles;
};

readDirectory("static/images").then(listOfFiles => {
  listOfFiles.forEach((inputFile) => {
    if (inputFile.indexOf("-thumb") > 0) {
      return;
    }
  
    if (fs.existsSync(`${inputFile.split(".")[0]}.webp`)) {
      return;
    }
  
    const outputFile = `${inputFile.split(".")[0]}.webp`;
  
    const outputFileThumb = `${inputFile.split(".")[0]}-thumb.webp`
  
    sharp(inputFile)
      .webp({ quality: 80 }) // set WebP quality to 80
      .toFile(outputFile)
      .then((info) => {
        console.log(`Image ${inputFile} was optimized`);
      })
      .catch((err) => {
        console.log(`An error occured while processing ${inputFile}: ${err}`);
      });
  
    sharp(inputFile)
      .resize({ width: 700, height: 700, fit: "inside" })
      .webp({ quality: 80 }) // set WebP quality to 80
      .toFile(outputFileThumb)
      .then((info) => {
        console.log(`Image ${inputFile} was resized and optimized`);
      })
      .catch((err) => {
        console.log(`An error occured while processing ${inputFile}: ${err}`);
      });
  });
  
});

