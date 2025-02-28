import { Command } from "commander";
import { input, } from "@inquirer/prompts";
import { red, cyan, bold } from "picocolors";
import Conf from "conf";

import packageJson from "../package.json";
import { isValidProjectName } from "./lib/validate-project-name";
import { userInputData } from "./lib/constants";
import { exitCli } from "./lib/functions";
import { isValidGitRepoUrl } from "./lib/validate-git-url";
import handleAppCreation from "./handle-app-creation";


console.log(bold(
  cyan(
  `This utility will walk you through creating a NextJs app using app router.`
  )
));
console.log();

let projectName: string;

const program = new Command(packageJson.name)
  .description(packageJson.description)
  .version(
    packageJson.version, 
    "-v, --version", 
    "Output the current version of tb-create-next-app."
  )
  .argument(
    "[projectName]", "The project name"
  )
  .option(
    "--app-version <version>", "Specify the app version"
  )
  .option(
    "--app-description <description>", "Description for the project"
  )
  .option(
    "--git-repo <git-repo-url>", "Git repository url for the project"
  )
  .option(
    "--skip-git", "Specify this option to avoid git initialiazion"
  )
  .option(
    "--skip-install", "Avoid package installation"
  )
  .action((name)=>{
    projectName = name;
  })
  .allowUnknownOption()
  .parse(process.argv);


const opts = program.opts();

async function appCreationFlow(){
  const config = new Conf({projectName: "tb-create-next-app"});

  /* project name */
  if(!projectName){
    projectName = await input({
      message: `What is your project ${cyan("name")}:`,
      required: true,
      validate: (projectName) => {
        const result = isValidProjectName(projectName);
        return typeof result === 'boolean' ? result : result[0];
      }
    })
  }else{
    const result = isValidProjectName(projectName);
    if(typeof result !== "boolean"){
      console.error(red(`Project ${result[0]}`));
      exitCli();
    }
  }
  userInputData.projectName = projectName.trim();

  /* project description */
  let appDescription: string = opts.appDescription;
  if(!appDescription){
    appDescription = await input({
      message: `Project ${cyan("description")}:`,
    })
  }
  userInputData.appDescription = appDescription;

  /* project version */
  let appVersion: string = opts.appVersion || config.get('app_version');
  if(!appVersion){
    appVersion = await input({
      message: `Project ${cyan("version")}:`,
      default: "0.1.0",
    })
  }
  userInputData.appVersion = appVersion;
  config.set("app_version", appVersion);

  /* Git repo url */
  let repoUrl: string = opts.gitRepo;
  if(!repoUrl){
    repoUrl = await input({
      message: `Git ${cyan("repository url")}: `,
      validate: (value) => {
        if(!value){
          return true;
        }
        const isValid = isValidGitRepoUrl(value);
        return isValid.valid ? true : isValid.message;
      },
    })
  }
  userInputData.gitRepoUrl = repoUrl;

  await handleAppCreation(userInputData);
}

appCreationFlow()