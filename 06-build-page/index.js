const path = require('path');
const FSP = require('fs').promises;
const fs = require('fs');
const OPTIONS = {withFileTypes: true};
const pathToDist = path.join(__dirname, 'project-dist');
const assetsDir = path.join(__dirname,'assets');
const pathAssetsDestination = path.join(pathToDist,'assets');
const stylesDir = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
const pathTemplate = path.join(__dirname, 'template.html');
const templateData = [];
const stream = fs.ReadStream(pathTemplate, 'utf-8');
let outputTemplate = '';
const componentsPath = path.join(__dirname, 'components');

async function copyDir(src,dest) {
  const entries = await FSP.readdir(src, {withFileTypes: true});
  await FSP.mkdir(dest);
  for(let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if(entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await FSP.copyFile(srcPath, destPath);
    }
  }
}

async function mergeFiles(srcDir, bundlePath){
  let outputArr = [];
  const files = FSP.readdir(srcDir, OPTIONS);
  files.then((filesFetched) => {
    for (let fileDirent of filesFetched) {
      const pathToFile = path.join(srcDir, fileDirent.name);
      const fileExtention = path.extname(pathToFile);
      if (fileExtention === '.css') {
        const stream = FSP.readFile(pathToFile, 'utf-8');
        stream.then((chunk) => {
          outputArr.push(chunk);
          fs.writeFile(bundlePath, outputArr.join('\n\n'), (err) => {
            if (err) throw err;
          });
        });
      }
    }
  });}

(async () => {
  await FSP.rm(pathToDist, { recursive: true, force: true});
  await FSP.mkdir(pathToDist, {recursive: true});
  await copyDir(assetsDir,pathAssetsDestination);   
  await mergeFiles(stylesDir, bundlePath);
  stream.on('data', (chunk) => {
    templateData.push(chunk);
  });
  stream.on('end', async () => {
    outputTemplate = templateData.join('');
    const regexp = /{{.*}}/gi;
    const matches_array = templateData.join('').match(regexp);
    const components = await FSP.readdir(componentsPath, OPTIONS);
    for (let file of components){
      const pathToFile = path.join(componentsPath, file.name);
      const fileExtention = path.extname(pathToFile);
      if (fileExtention === '.html' && !file.isDirectory()){
        const fileName = file.name.slice(0,-5);
        if (matches_array.includes(`{{${fileName}}}`)) {
          const streamComponent = fs.ReadStream(pathToFile, 'utf-8');
          const componentData = [];
          streamComponent.on('data', (chunk) => {
            componentData.push(chunk);
          });
          streamComponent.on('end', () => {
            outputTemplate=outputTemplate.replaceAll(`{{${fileName}}}`, componentData.join(''));
            const bundleHTMLPath = path.join(__dirname, 'project-dist', 'index.html'); 
            FSP.writeFile(bundleHTMLPath, outputTemplate, (err) => {
              if (err) throw err;
            });
          });
        }
      }
    }
  });
})();
