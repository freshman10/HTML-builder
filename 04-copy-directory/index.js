const fs = require('fs');
const path = require('path');


function copyDir() {
  const pathToDir = path.join(__dirname, 'files-copy');
  const pathToOriginalDir = path.join(__dirname, 'files');
  fs.promises.rm(pathToDir,{ recursive: true, force: true }).then(() => fs.promises.mkdir(pathToDir, {recursive: true})).then(() => {
    const options = {withFileTypes: true};
    const files = fs.promises.readdir(pathToOriginalDir, options);
    files.then((direntFiles) => {
      for (let f of direntFiles) {
        if (f.isFile()) {
          const destination = path.join(pathToDir, f.name);
          const source = path.join(pathToOriginalDir, f.name);
          fs.promises.copyFile(source, destination);
        }
      }
    });
  });
}

copyDir();