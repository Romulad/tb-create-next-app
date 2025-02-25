import { Command } from "commander";
import { input } from "@inquirer/prompts";
import { mkdirSync, accessSync, copyFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { red, green, cyan, italic } from "picocolors";
import { W_OK } from "node:constants";
import { globSync } from "fast-glob";

import packageJson from "../package.json";
import { isValidProjectName } from "./lib/validate-project-name";
import { TEMPLATE_NAMES, TEMPLATES_DIRECTORY_NAME } from "./lib/constants";
import { exitCli } from "./lib/functions";
import { exec, execSync } from "node:child_process";



let projectName: string;

const tbCreateAppCommand = new Command(packageJson.name)
  .description(packageJson.description)
  .version(
    packageJson.version, 
    "-v, --version", 
    "Output the current version of tb-create-next-app."
  )
  .argument("[projectName]", "The project name")
  .option("--skip-git", "Specify this option to avoid git initialiazion")
  .option("--skip-install", "Avoid package installation")
  .action((name)=>{
    projectName = name;
  })
  .allowUnknownOption()
  .parse(process.argv);


const opts = tbCreateAppCommand.opts();

async function appCreationFlow(){
  if(!projectName){
    projectName = await input({
      message: "What is your project name",
      required: true,
      validate: (projectName) => {
        const result = isValidProjectName(projectName);
        return typeof result === 'boolean' ? result : result[0];
      }
    })
  }else{
    const result = isValidProjectName(projectName);
    if(typeof result !== "boolean"){
      console.error(red(`Project name: ${result[0]}`));
      exitCli();
    }
  }

  const projectPath = resolve(projectName);
  const projectDirPath = dirname(projectPath);
  const templatePath = join(
    __dirname, TEMPLATES_DIRECTORY_NAME, TEMPLATE_NAMES.appDefault
  );

  try{
    accessSync(projectDirPath, W_OK);
  }catch(error){
    console.error(
      red('The application path is not writable, please check folder permissions and try again.')
    )
    console.error(
      red('It is likely you do not have write permissions for this folder.')
    )
    exitCli();
  }
  
  mkdirSync(projectPath, { recursive: true });
  process.chdir(projectPath);

  const matcheFilePaths = globSync("**", {
    cwd: templatePath,
    dot: true,
    absolute: false
  })

  matcheFilePaths.forEach((filePath)=>{
    const sourceFileDirectory = dirname(filePath);
    const sourceFilePath = join(templatePath, filePath);

    mkdirSync(sourceFileDirectory, { recursive: true });

    try{
      copyFileSync(sourceFilePath, filePath);
    }catch{
      console.log(`error for file ${cyan(filePath)}`);
    }
  })

  // Create flow to ask user to enter project detail like with npm init
  // Check and find out what package version to use for dependencies and devdepencies
  const packageJsonFile = {
    "name": packageJson.name,
    "version": "0.1.0",
    "description": "",
    "main": "./index.ts",
    "scripts": {
      "dev": "next dev --turbopack",
      "build": "next build",
      "start": "next start",
      "lint": "next lint"
    },
    devDependencies: {
      "@eslint/eslintrc": "^3",
      "@types/node": "^20",
      "@types/react": "^19",
      "@types/react-dom": "^19",
      "eslint": "^9",
      "eslint-config-next": "15.1.6",
      "typescript": "^5"
    },
    dependencies: {
      "next": "15.1.6",
      "next-auth": "^4.24.11",
      "react": "^19.0.0",
      "react-dom": "^19.0.0",
    }
  }

  writeFileSync('package.json', JSON.stringify(packageJsonFile, null, 2));

  if(!opts.skipInstall){
    console.log(
      italic(cyan("Installing package"))
    )
    execSync("npm install") // user should be able to choose package manager
  }

  if(!opts.skipGit){
    // Check if git exist before initialization
    console.log(
      italic(cyan("Initializing git"))
    )
    execSync('git init')
    execSync('git add .; git commit -m "Initiale commit from Tobi create next app"')
  }
  
  console.log(`nextjs project named ${cyan(projectName)} created successfully`)
}

appCreationFlow()