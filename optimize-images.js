const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFolders = ['static/images/dzwon2022', 'static/images/dorsz2022'];

inputFolders.forEach(inputFolder => {
  fs.readdir(inputFolder, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if(file.indexOf("-thumb") > 0){
        return;
      }

      const inputFile = path.join(inputFolder, file);
      const outputFile = path.join(inputFolder, file.split('.')[0] + '-thumb.' + file.split('.')[1]);
      sharp(inputFile)
        .resize({ width: 500, height: 500, fit: 'inside' })
        .toFile(outputFile)
        .then(info => {
          console.log(`Image ${file} was resized and optimized`);
        })
        .catch(err => {
          console.log(`An error occured while processing ${file}: ${err}`);
        });
    });
  });
});