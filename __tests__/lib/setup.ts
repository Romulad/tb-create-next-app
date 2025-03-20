import { execSync } from "child_process";
import { existsSync } from "fs";
import { resolve } from "path";

export default async function () {
  const buildPath = resolve('dist');

  if(existsSync(buildPath)) return;

  try{
    console.log('Building project...');
    execSync('npm run build');
  }catch{
    console.error('Error while building the project...');
  }

  return async () => {};
}