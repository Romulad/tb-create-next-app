//@ts-nocheck
import { resolve } from "path";
import { render } from "cli-testing-library";
import { existsSync, mkdirSync, rmdir, rmSync } from "fs";
import { execSync } from "child_process";


export const waitFor = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Successfully");
    }, timeout);
  });
}

export const renderCli = async (args=[""], options={}) => {
  const cliPath = resolve("dist", "index.js");
  const renderResult = await render("node", [cliPath, ...args], options);

  // The cli can take some time before rendering to the screen
  await waitFor(2000); 

  return renderResult;
}

export const getProjectTestDirPath = () => {
  const testPath = resolve('..', "test-tb-create-next-app");
  if(!existsSync(testPath)) mkdirSync(testPath, { recursive: true });
  return testPath;
}

export const clearTestProjectDir = (dirPath) => {
  try{
    rmSync(dirPath, { recursive: true, force: true });
    mkdirSync(dirPath, { recursive: true });
    return true;
  }catch{
    return false;
  }
}