import { UserInputData } from "../lib/decalrations";

export default function createAppFromTemplate(
  data: UserInputData, 
){
  // const projectPath = resolve(projectName);
  // const projectDirPath = dirname(projectPath);
  // const templatePath = join(
  //   __dirname, TEMPLATES_DIRECTORY_NAME, TEMPLATE_NAMES.appDefault
  // );

  // try{
  //   accessSync(projectDirPath, W_OK);
  // }catch(error){
  //   console.error(
  //     red('The application path is not writable, please check folder permissions and try again.')
  //   )
  //   console.error(
  //     red('It is likely you do not have write permissions for this folder.')
  //   )
  //   exitCli();
  // }
  
  // mkdirSync(projectPath, { recursive: true });
  // process.chdir(projectPath);

  // const matcheFilePaths = globSync("**", {
  //   cwd: templatePath,
  //   dot: true,
  //   absolute: false
  // })

  // matcheFilePaths.forEach((filePath)=>{
  //   const sourceFileDirectory = dirname(filePath);
  //   const sourceFilePath = join(templatePath, filePath);

  //   mkdirSync(sourceFileDirectory, { recursive: true });

  //   try{
  //     copyFileSync(sourceFilePath, filePath);
  //   }catch{
  //     console.log(`error for file ${cyan(filePath)}`);
  //   }
  // })

  // // Create flow to ask user to enter project detail like with npm init
  // // Check and find out what package version to use for dependencies and devdepencies
  // const packageJsonFile = {
  //   "name": projectName,
  //   "version": appVersion,
  //   "description": appDescription,
  //   "scripts": {
  //     "dev": "next dev --turbopack",
  //     "build": "next build",
  //     "start": "next start",
  //     "lint": "next lint"
  //   },
  //   devDependencies: {
  //     "@eslint/eslintrc": "^3",
  //     "@types/node": "^20",
  //     "@types/react": "^19",
  //     "@types/react-dom": "^19",
  //     "eslint": "^9",
  //     "eslint-config-next": "15.1.6",
  //     "typescript": "^5"
  //   },
  //   dependencies: {
  //     "next": "15.1.6",
  //     "next-auth": "^4.24.11",
  //     "react": "^19.0.0",
  //     "react-dom": "^19.0.0",
  //   }
  // }

  // writeFileSync('package.json', JSON.stringify(packageJsonFile, null, 2));

  // if(!opts.skipInstall){
  //   console.log(
  //     italic(cyan("Installing package"))
  //   )
  //   execSync("npm install") // user should be able to choose package manager
  // }

  // if(!opts.skipGit){
  //   // Check if git exist before initialization
  //   console.log(
  //     italic(cyan("Initializing git"))
  //   )
  //   execSync('git init')
  //   execSync('git add .; git commit -m "Initiale commit from Tobi create next app"')
  // }
  
  // console.log(`nextjs project named ${cyan(projectName)} created successfully`)
}