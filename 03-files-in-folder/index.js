const path = require('path');
const fs = require('fs');

const dirPath = path.join(__dirname,'secret-folder');
const options = {withFileTypes: true};
const files = fs.promises.readdir(dirPath, options);
files.then((direntFiles) => {
  for (let f of direntFiles) {
    if (f.isFile()) {
      const pathToFile = path.join(__dirname, 'secret-folder', f.name);
      fs.stat(pathToFile, (err, stats) => {
        if (err) throw err;
        console.log(`${f.name.split('.').slice(0,-1).join('')} - ${path.extname(pathToFile).split('').slice(1,).join('')} - ${stats.size} byte`);
      });

    }
   
  }
});
