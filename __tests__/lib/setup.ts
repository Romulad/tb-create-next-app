const { execSync } = require('child_process');
const { existsSync } = require('fs');
const { resolve } = require('path');


async function setUpt() {
  const buildPath = resolve('dist');

  if(existsSync(buildPath)) return;

  try{
    console.log('Building project...');
    execSync('npm run build');
  }catch{
    console.error('Error while building the project...');
  }
}

module.exports = setUpt;