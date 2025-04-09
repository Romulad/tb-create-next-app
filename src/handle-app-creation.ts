import { resolve } from "path";

import { TEMPLATE_NAMES, TEMPLATES_DIRECTORY_NAME } from "./lib/constants";
import createProjectDir from "./lib/create-project-dir";
import { UserInputData } from "./lib/decalrations";
import { exitCli } from "./lib/functions";
import createAppFromTemplate from "./create-from-template";
import { getDirName } from "./lib/dir-utils";

export default async function handleAppCreation({
  projectName,
  appVersion,
  appDescription,
  gitRepoUrl,
  skipGit,
  skipInstall,
  pckManager,
}: UserInputData) {
  const projectPath = await createProjectDir(projectName);
  if (!projectPath) {
    exitCli();
    return;
  }

  const templatePath = resolve(
    getDirName(),
    TEMPLATES_DIRECTORY_NAME,
    TEMPLATE_NAMES.appDefault,
  );

  createAppFromTemplate({
    appDescription,
    appVersion,
    gitRepoUrl,
    projectName,
    projectPath,
    skipGit,
    skipInstall,
    templatePath,
    pckManager,
  });
}
