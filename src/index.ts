#!/usr/bin/env node
import { Command } from "commander";
import { input, select } from "@inquirer/prompts";
import { red, cyan, yellow, bold } from "picocolors";

import packageJson from "../package.json";
import { isValidProjectName } from "./lib/validate-project-name";
import {
  userAppConfig,
  userAppConfigKeys,
  userInputData,
} from "./lib/constants";
import { exitCli, isValidPckManager } from "./lib/functions";
import { isValidGitRepoUrl } from "./lib/validate-git-url";
import handleAppCreation from "./handle-app-creation";

process.on("uncaughtException", (error) => {
  if (error instanceof Error && error.name === "ExitPromptError") {
    console.log(`\nAborted...! ${cyan("See you next time 👋")}`);
  } else {
    throw error;
  }
});

let projectName: string;

const program = new Command(packageJson.name)
  .description(packageJson.description)
  .version(
    packageJson.version,
    "-v, --version",
    "Output the current version of tb-create-next-app.",
  )
  .argument("[projectName]", "The project name")
  .option("--app-version <version>", "Specify the app version")
  .option("--app-description <description>", "Description for the project")
  .option("--git-repo <git-repo-url>", "Git repository url for the project")
  .option(
    "--pck-manager <package-manager>",
    "Package manager to use; can be npm, yarn, pnpm, bun or any valid package manager",
  )
  .option("--skip-git", "Specify this option to avoid git initialization")
  .option("--skip-install", "Skip package installation")
  .action((name) => {
    projectName = name;
  })
  .allowUnknownOption()
  .parse(process.argv);

const opts = program.opts();

async function appCreationFlow() {
  console.log(
    bold(
      cyan(
        `\nThis utility will walk you through creating a NextJs app using app router.`,
      ),
    ),
  );

  /* pck manager validation if specified */
  const specifiedPckManager = opts.pckManager;
  if (specifiedPckManager && !isValidPckManager(specifiedPckManager)) {
    console.log(
      yellow(
        `\nYou’ve selected a different package manager than npm, yarn, pnpm or bun: ${cyan(specifiedPckManager)}`,
      ),
    );
  }

  /* Git repo url validation if specified */
  let specifiedGitUrl = opts.gitRepo;
  if (specifiedGitUrl) {
    const result = await isValidGitRepoUrl(specifiedGitUrl);
    if (result.isDeconnected) {
      console.log(`\n${yellow(result.message)}`);
    } else if (!result.valid) {
      console.error(red(`\n${result.message}`));
      specifiedGitUrl = "";
    }
  }
  userInputData.gitRepoUrl = specifiedGitUrl;

  /* project name */
  if (!projectName) {
    projectName = await input({
      message: `What is your project ${cyan("name")}:`,
      required: true,
      validate: (projectName) => {
        const result = isValidProjectName(projectName);
        return typeof result === "boolean" ? result : result[0];
      },
    });
  } else {
    const result = isValidProjectName(projectName);
    if (typeof result !== "boolean") {
      console.error(red(`Project ${result[0]}`));
      exitCli();
    }
  }
  userInputData.projectName = projectName.trim();

  /* project description */
  let appDescription: string = opts.appDescription;
  if (!appDescription) {
    appDescription = await input({
      message: `Project ${cyan("description")}:`,
    });
  }
  userInputData.appDescription = appDescription;

  /* project version */
  let appVersion: string = opts.appVersion;
  if (!appVersion) {
    const defaulAppVersion = userAppConfig.get(
      userAppConfigKeys.appVersion,
    ) as string;
    appVersion = await input({
      message: `Project ${cyan("version")}:`,
      default: defaulAppVersion,
    });
  }
  userInputData.appVersion = appVersion;
  userAppConfig.set(userAppConfigKeys.appVersion, appVersion);

  /* Git repo url */
  if (!opts.gitRepo) {
    userInputData.gitRepoUrl = await input({
      message: `Git ${cyan("repository url")}: `,
      validate: async (value) => {
        if (!value) return true;
        const isValid = await isValidGitRepoUrl(value);
        if (isValid.isDeconnected) return true;
        return isValid.valid ? true : (isValid.message ?? "Error");
      },
    });
  }

  /* Package manager */
  let pckManager: string = specifiedPckManager;
  if (!pckManager) {
    pckManager = await select({
      message: `Which package do you want to use? ${cyan("select a choice")}:`,
      choices: [
        {
          value: "npm",
          description: "A widely used package manager for JavaScript",
        },
        {
          value: "yarn",
          description: "Fast and reliable package manager for JavaScript",
        },
        {
          value: "pnpm",
          description: "Fast, disk space efficient package manager",
        },
        {
          value: "bun",
          description: "Package manager designed to be a dramatically fast",
        },
      ],
      default: userAppConfig.get(userAppConfigKeys.pckManager) || "npm",
    });
  }
  userInputData.pckManager = pckManager;

  await handleAppCreation({
    appDescription: userInputData.appDescription,
    appVersion: userInputData.appVersion,
    gitRepoUrl: userInputData.gitRepoUrl,
    pckManager: userInputData.pckManager,
    projectName: userInputData.projectName,
    skipGit: opts.skipGit,
    skipInstall: opts.skipInstall,
  });
}

appCreationFlow();
