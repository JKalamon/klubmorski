/* to use it you will need to npm i exif */ 
/* but build server requires localfile version 1 that's why I did not update package.json file */

const fs = require("fs");
const path = require("path");
const ExifImage = require("exif").ExifImage;

const inputFolder = "static/images/galerie/srebrny-dzwon-2023";
const outputFolder = "static/images/galerie/srebrny-dzwon-2023";
const prefix = "sdz23_";

// Read files from the input folder
fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  // Filter out non-image files
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
  });

  // Get EXIF data for all image files
  const imageInfoPromises = imageFiles.map(file => {
    const filePath = path.join(inputFolder, file);
    return getImageInfo(filePath);
  });

  // Wait for all promises to resolve
  Promise.all(imageInfoPromises)
    .then(imageInfoList => {
      // Sort image files by taken time
      imageFiles.sort((fileA, fileB) => {
        const imageInfoA = imageInfoList.find(info => info.file === fileA);
        const imageInfoB = imageInfoList.find(info => info.file === fileB);

        if (imageInfoA && imageInfoB) {
          return imageInfoA.taken - imageInfoB.taken;
        } else {
          return 0;
        }
      });

      // Rename and move sorted files
      imageFiles.forEach((file, index) => {
        const oldFilePath = path.join(inputFolder, file);
        const paddedIndex = (index + 1).toString().padStart(3, '0');
        const newFileName = `${prefix}${paddedIndex}${path.extname(file)}`;
        const newFilePath = path.join(outputFolder, newFileName);

        fs.rename(oldFilePath, newFilePath, err => {
          if (err) {
            console.error('Error renaming/moving file:', err);
          } else {
            console.log(`Renamed ${file} to ${newFileName}`);
          }
        });
      });
    })
    .catch(error => {
      console.error('Error getting image info:', error);
    });
});

function parseExifDate(dateString) {
  const parts = dateString.split(' ');
  const datePart = parts[0].replace(/:/g, '-');
  const timePart = parts[1];
  return `${datePart} ${timePart}`;
}

function getImageInfo(filePath) {
  return new Promise((resolve, reject) => {
    try {
      new ExifImage({ image: filePath }, (error, exifData) => {
        if (error) {
          reject(error);
        } else {
          const taken = exifData.exif.DateTimeOriginal || exifData.image.ModifyDate;          
          resolve({ file: path.basename(filePath), taken: new Date(parseExifDate(taken)).getTime() });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}