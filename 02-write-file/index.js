const path = require('path');
const fs = require('fs');
const readline = require('readline');
const os = require('os');

const filePath = path.join(__dirname,'text.txt');
const streamInput = readline.createInterface({input: process.stdin, output: process.stdout});
fs.writeFile(filePath, '', (err) => {
  if (err) throw err;
});

if (os.platform().slice(0, -2) === 'win') {
  process.on('SIGINT',() => {
    process.exit();
  });
}
streamInput.question('Input something, please :\n', (userInput)=> {
  if (userInput === 'exit') {
    streamInput.close();
  } else {
    fs.writeFile(filePath, userInput + '\n', (err) => {
      if (err) throw err;
    });
    streamInput.on('line', (userInput) => {
      if (userInput === 'exit') {
        streamInput.close();
      } else {
        fs.appendFile(filePath, userInput + '\n', (err) => {
          if (err) throw err;
        });
      }
    });
  }
});

streamInput.on('close', () => {
  console.log('Good bye! I\'m closing the app...');
});