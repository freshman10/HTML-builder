const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

function mergeFiles(srcDir, bundlePath){
  let outputArr = [];
  const options = {withFileTypes: true};
  const files = fs.promises.readdir(srcDir, options);
  files.then((filesFetched) => {
    for (let fileDirent of filesFetched) {
      const pathToFile = path.join(srcDir, fileDirent.name);
      const fileExtention = path.extname(pathToFile);
      if (fileExtention === '.css') {
        const stream = fs.promises.readFile(pathToFile, 'utf-8');
        stream.then((chunk) => {
          outputArr.push(chunk);
          fs.writeFile(bundlePath, outputArr.join('\n\n'), (err) => {
            if (err) throw err;
          });
        });
      }
    }
  });}

mergeFiles(stylesDir, bundlePath);