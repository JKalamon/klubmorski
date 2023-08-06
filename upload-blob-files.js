const { BlobServiceClient } = require('@azure/storage-blob');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

// Configuration variables
const containerName = 'hires';
const folders = ['./static/images/galerie/srebrny-dzwon-2023'];
const stateFilePath = './uploaded-files.json';

// Load the Azure Blob Storage connection string from connection_string.txt
const connectionString = fs.readFileSync(path.join(__dirname, 'connection_string.txt'), 'utf8').trim();

// Load the list of previously uploaded files
let uploadedFiles = [];
if (fs.existsSync(stateFilePath)) {
  uploadedFiles = JSON.parse(fs.readFileSync(stateFilePath));
}

// Create a BlobServiceClient object
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

// Create a BlobContainerClient object
const containerClient = blobServiceClient.getContainerClient(containerName);

// Define an async function to upload the files
async function uploadFiles() {
  // Loop through each folder and upload any new *.jpg files
  for (const folder of folders) {
    const files = glob.globSync(`${folder}/**/*.jpg`);
    console.log(files);
    for (const file of files) {
      const relativePath = path.relative(folder, file);
      if (uploadedFiles.includes(relativePath)) {
        console.log(`Skipping ${file} (already uploaded)`);
        continue;
      }
      const folderName = path.basename(path.dirname(file));
      const blobName = `${folderName}-${path.basename(file)}`;
      const blobClient = containerClient.getBlockBlobClient(blobName);
      const uploadResult = await blobClient.uploadFile(file);
      console.log(`Uploaded ${file} as ${blobName}`);
      uploadedFiles.push(relativePath);
    }
  }

  // Save the list of uploaded files
  fs.writeFileSync(stateFilePath, JSON.stringify(uploadedFiles));
}

// Call the uploadFiles function
uploadFiles().catch((err) => {
  console.error(err);
  process.exit(1);
});
