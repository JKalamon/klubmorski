const fs = require('fs');
const path = require('path');

// Define the input directory
const inputDirectory = 'input';

// Recursively read the input directory and its subdirectories
const readDirectory = (dir) => {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;

    // Loop through each file in the directory
    for (const file of files) {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;

        // If the file is a directory, read it recursively
        if (stats.isDirectory()) {
          readDirectory(filePath);
        } else {
          // Check if the file name ends with "-thumb"
          if (file.endsWith('.webp')) {
            // Delete the file
            fs.unlink(filePath, (err) => {
              if (err) throw err;
              console.log(`File "${file}" was deleted successfully.`);
            });
          }
        }
      });
    }
  });
};

// Start reading the input directory
readDirectory('static/images');