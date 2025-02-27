import { basename, dirname, join } from "path";
import createProjectDir from "./lib/create-project-dir";
import { UserInputData } from "./lib/decalrations";
import { exitCli } from "./lib/functions";
import { TEMPLATE_NAMES, TEMPLATES_DIRECTORY_NAME } from "./lib/constants";
import { globSync } from "fast-glob";
import { copyFileSync, mkdirSync, writeFileSync } from "fs";
import { cyan, italic, red } from "picocolors";
import { execSync } from "child_process";


export default async function handleAppCreation({
  projectName,
  appVersion,
  appDescription,
  gitRepoUrl,
  skipGit,
  skipInstall
} : UserInputData) {
  const projectPath = await createProjectDir(projectName);
  if(!projectPath){
    exitCli();
    return;
  }

  const templatePath = join(
    __dirname, TEMPLATES_DIRECTORY_NAME, TEMPLATE_NAMES.appDefault
  );
  
  process.chdir(projectPath);

  const matcheFilePaths = globSync("**", {
    cwd: templatePath,
    dot: true,
    absolute: false
  })

  matcheFilePaths.forEach((filePath)=>{
    const sourceFileDirectory = dirname(filePath);
    const sourceFilePath = join(templatePath, filePath);
    const fileName = basename(filePath);

    if(fileName === "env.local"){
    filePath = join(sourceFileDirectory, ".env.local");
    }else if(fileName === "_next-env.d.ts"){
    filePath = join(sourceFileDirectory, "next-env.d.ts");
    }

    mkdirSync(sourceFileDirectory, { recursive: true });

    try{
      copyFileSync(sourceFilePath, filePath);
    }catch{
      console.log(`error while copying files`);
    }
  })

  const packageJsonFile = {
    "name": projectName,
    "version": appVersion,
    "description": appDescription,
    "scripts": {
      "dev": "next dev --turbopack",
      "build": "next build",
      "start": "next start",
      "lint": "next lint"
    },
    dependencies: {
      "next": "^15.1.6",
      "react": "^19.0.0",
      "react-dom": "^19.0.0",
    },
    devDependencies: {
      "@eslint/eslintrc": "^3",
      "@types/node": "^20",
      "@types/react": "^19",
      "@types/react-dom": "^19",
      "eslint": "^9",
      "eslint-config-next": "15.1.6",
      "typescript": "^5"
    }
  }

  writeFileSync('package.json', JSON.stringify(packageJsonFile, null, 2));

  console.log();

  if(!skipInstall){
    console.log(
      italic(cyan("Installing packages..."))
    )
    console.log();

    try{
      execSync("npm install", { stdio: "inherit" });  // user should be able to choose package manager and I should check existence before used
    }catch{
      console.log(red('Error while installing packages'));
    }
  }

   if(!skipGit){
      // Check if git exist before initialization
    console.log();
    console.log(
      italic(cyan("Initializing git..."))
    )

    try{
      execSync(
        `git init; git add .; git commit -m "Initiale commit from Tobi create next app`,
        { stdio: "ignore" }
      )
      if(gitRepoUrl){
        execSync(`git remote add origin ${gitRepoUrl}`, { stdio: "ignore" });
      }
     }catch{
      console.log(red('Error while installing packages'))
    }
  }
  
   console.log(`nextjs project named ${cyan(projectName)} created successfully`)
}