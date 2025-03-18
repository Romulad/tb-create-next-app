import { resolve } from "path";
import { render } from "cli-testing-library";
import { existsSync, mkdirSync, rmdir, rmSync } from "fs";
import { testProjectDirPath } from "./constants";


export const waitFor = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Successfully");
    }, timeout);
  });
}

export const renderCli = async (
  args?: string[], options?: Record<string, unknown>
) => {
  const cliPath = resolve("dist", "index.js");
  const renderResult = await render("node", [cliPath, ...(args || [])], options);
  // The cli can take some time before rendering to the screen
  await waitFor(2000); 
  return renderResult;
}

export const getProjectTestDirPath = () => {
  if(!existsSync(testProjectDirPath)) mkdirSync(testProjectDirPath, { recursive: true });
  return testProjectDirPath;
}

export const clearTestProjectDir = (dirPath=testProjectDirPath) => {
  try{
    rmSync(dirPath, { recursive: true, force: true });
    mkdirSync(dirPath, { recursive: true });
    return true;
  }catch{
    return false;
  }
}