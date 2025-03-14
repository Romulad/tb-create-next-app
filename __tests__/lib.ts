//@ts-nocheck
import { resolve } from "path";
import { render } from "cli-testing-library";


export const waitFor = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Successfully");
    }, timeout);
  });
}

export const renderCli = async (args=[]) => {
  const cliPath = resolve("dist", "index.js");
  const renderResult = await render("node", [cliPath, ...args]);

  // The cli can take some time before rendering to the screen
  await waitFor(1000); 

  return renderResult;
}