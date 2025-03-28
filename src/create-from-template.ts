import { globSync } from "fast-glob";
import { basename, dirname, join } from "path";
import { copyFileSync, mkdirSync, writeFileSync } from "fs";
import { cyan } from "picocolors";

import { UserInputData } from "./lib/decalrations";
import { defaultPackageJson } from "./lib/constants";
import { installPackages } from "./lib/install-packages";
import { initializeGit } from "./lib/initialize-git";
interface CreateAppFromTemplate extends UserInputData {
  templatePath: string;
  projectPath: string;
}

export default function createAppFromTemplate({
  projectPath,
  templatePath,
  projectName,
  appDescription,
  appVersion,
  skipGit,
  skipInstall,
  gitRepoUrl,
  pckManager,
}: CreateAppFromTemplate) {
  process.chdir(projectPath);

  const matchedFilePaths = globSync(["**"], {
    cwd: templatePath,
    dot: true,
    absolute: false,
  });

  matchedFilePaths.forEach((filePath) => {
    const sourceFileDirectory = dirname(filePath);
    const sourceFilePath = join(templatePath, filePath);
    const fileName = basename(filePath);

    if (fileName === "env.local") {
      filePath = join(sourceFileDirectory, ".env.local");
    } else if (fileName === "_next-env.d.ts") {
      filePath = join(sourceFileDirectory, "next-env.d.ts");
    } else if (fileName === "_README.md") {
      filePath = join(sourceFileDirectory, "README.md");
    } else if (fileName === "gitignore") {
      filePath = join(sourceFileDirectory, ".gitignore");
    }

    /* make sure the directory already exist in the project dir */
    mkdirSync(sourceFileDirectory, { recursive: true });

    try {
      copyFileSync(sourceFilePath, filePath);
    } catch {
      console.log(`error while copying ${filePath}`);
    }
  });

  /* Create package.json file */
  defaultPackageJson.name = projectName;
  defaultPackageJson.description = appDescription;
  defaultPackageJson.version = appVersion;
  if (gitRepoUrl) {
    defaultPackageJson.repository.url = gitRepoUrl;
  } else {
    delete (defaultPackageJson as any).repository;
  }
  writeFileSync("package.json", JSON.stringify(defaultPackageJson, null, 2));

  /* Install packages */
  if (!skipInstall) {
    installPackages(pckManager);
  }

  /* Initialize git */
  if (!skipGit) {
    initializeGit(gitRepoUrl);
  }

  console.log(
    `\nNextjs project named ${cyan(projectName)} created successfully!`,
  );
}
