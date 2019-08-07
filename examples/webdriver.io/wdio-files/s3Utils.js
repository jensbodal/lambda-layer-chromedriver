const aws = require('aws-sdk');
const { createReadStream, readdirSync, statSync } = require('fs');
const path = require('path');

const s3 = new aws.s3();

const uploadFolder = async(sourceFolder, targetBucket, targetPath) => {
  const absolutePath = path.resolve(sourceFolder);
  const files = readdirSync(absolutePath);

  for (const file of files) {
    const filepath = path.join(absolutePath, file);

    if (await statSync(filepath).isDirectory()) {
      const destPath = path.join(targetPath, filepath.split('/').pop());
      await uploadFolder(filepath, targetBucket, destPath);
    } else {
      const targetKey = path.join(targetPath, file);
      try {
        await uploadFile(filepath, targetBucket, targetKey);
      } catch(e) {
        console.log('Error uploading file');
        console.log(e);
      }
    }
  }
}

const uploadFile = async(sourceFile, targetBucket, targetKey) => {
  return new Promise((resolve, reject) => {
    const fileStream = createReadStream(sourceFile);
    console.log(`Uploading ${sourceFile.split('/').pop()} to ${targetBucket}/${targetKey}`);

    s3.putObject({
      Bucket: targetBucket,
      Key: targetKey,
      Body: fileStream
    }, (err) => {
      if (err) {
        console.log(err, err.stack);
        return reject(err);
      } else {
        console.log(`${targetKey} upload complete.`);
        return resolve();
      }
    }).on('httpUploadProgress', (progress) => {
      console.log(`Uploaded ${progress.loaded} of ${progress.total} bytes`);
    });
  });
}

exports.uploadFolderS3 = uploadFolder;
