import { globSync } from "fast-glob";
import { basename, dirname, join } from "path";
import { copyFileSync, mkdirSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { red, cyan } from "picocolors";

import { UserInputData } from "../lib/decalrations";
import { defaultPackageJson } from "../lib/constants";
import isGitInstalled from "../lib/git-is-installed";


interface CreateAppFromTemplate extends UserInputData {
  templatePath: string;
  projectPath: string;
}

export default function createAppFromTemplate(
  {
    projectPath,
    templatePath,
    projectName,
    appDescription,
    appVersion,
    skipGit,
    skipInstall,
    gitRepoUrl
  } : CreateAppFromTemplate, 
){

  process.chdir(projectPath);

  const matchedFilePaths = globSync(["**"], {
    cwd: templatePath,
    dot: true,
    absolute: false,
  });

  matchedFilePaths.forEach((filePath)=>{
    const sourceFileDirectory = dirname(filePath);
    const sourceFilePath = join(templatePath, filePath);
    const fileName = basename(filePath);

    if(fileName === "env.local"){
      filePath = join(sourceFileDirectory, ".env.local");
    }
    else if(fileName === "_next-env.d.ts"){
      filePath = join(sourceFileDirectory, "next-env.d.ts");
    }
    else if(fileName === "_README.md"){
      filePath = join(sourceFileDirectory, "README.md");
    }
    else if(fileName === "gitignore"){
      filePath = join(sourceFileDirectory, ".gitignore");
    }

    /* make sure the directory already exist in the project dir */
    mkdirSync(
      sourceFileDirectory, { recursive: true }
    );

    try{
      copyFileSync(sourceFilePath, filePath);
    }catch{
      console.log(`error while copying ${filePath}`);
    }
  })

  /* Create package.json file */
  defaultPackageJson.name = projectName;
  defaultPackageJson.description = appDescription;
  defaultPackageJson.version = appVersion;

  if(gitRepoUrl){
    defaultPackageJson.repository.url = gitRepoUrl;
  }else{
    delete (defaultPackageJson as any).repository;
  }

  writeFileSync(
    'package.json', JSON.stringify(defaultPackageJson, null, 2)
  );

  console.log();

  /* Install packages */
  if(!skipInstall){
    console.log(cyan("Installing packages..."));

    try{
      execSync("npm install", { stdio: "inherit" });  // user should be able to choose package manager and I should check existence before used
    }catch{
      console.log(red('Error while installing packages'));
    }
  }

  console.log();

  /* Initialize git */
  const gitIsInstalled = isGitInstalled();
  if(!skipGit && gitIsInstalled){
    console.log(cyan("Initializing git..."));

    try{
      execSync(
        `git init; git add .; git commit -m "Initiale commit from Tobi create next app"`,
        { stdio: "inherit" }
      )
      if(gitRepoUrl){
        execSync(`git remote add origin ${gitRepoUrl}`, { stdio: "ignore" });
      }
    }catch{
      console.log(red('Error while initializing git'))
    }
  }else if(!gitIsInstalled){
    console.log(red(
      "Tried to initialize git, but it can't be found, please install it."
    ))
  }
  
  console.log(`Nextjs project named ${cyan(projectName)} created successfully!`);
}