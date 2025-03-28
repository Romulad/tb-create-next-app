import { red, cyan } from "picocolors";

import isGitInstalled from "./git-is-installed";
import { execCmdWithError } from "./functions";

export const initializeGit = (gitRepoUrl?: string) => {
  console.log(cyan("\nInitializing git..."));

  if (!isGitInstalled()) {
    console.log(
      red("Tried to initialize git, but it can't be found, please install it."),
    );
    return false;
  }

  const initialized = execCmdWithError(
    `git init && git add . && git commit -m "Initiale commit"`,
    `Error while initializing git`,
    "inherit",
  );

  if (gitRepoUrl) {
    execCmdWithError(
      `git remote add origin ${gitRepoUrl}`,
      `Error while adding git remote origin`,
      "ignore",
    ) && console.log(`Add git remote ${cyan("origin")} with ${gitRepoUrl}`);
  }

  return initialized;
};
