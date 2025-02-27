import { dirname, resolve } from "path";
import { isDirEmpty, isDirWritable } from "./dir-utils";
import { exitCli } from "./functions";
import { existsSync, mkdirSync, rmSync } from "fs";
import { red, yellow, cyan } from "picocolors";
import { select } from "@inquirer/prompts";


export default async function createProjectDir(
  projectName: string
){
  const projectPath = resolve(projectName);
  const projectDirPath = dirname(projectPath);

  /* Check if the parent dir is writable */
  if(!isDirWritable(projectDirPath)){
    console.error(
      red('The application path is not writable, please check folder permissions and try again.')
    )
    console.error(
      red('It is likely you do not have write permissions for this folder.')
    )
    exitCli();
  }

  if(!existsSync(projectPath)){
    mkdirSync(projectPath, { recursive: true });
    return projectPath;
  }

  console.log()
  console.log(yellow("The project directory already exist..."))

  /* Since the project dir exist, check if it is writable too */
  if(!isDirWritable(projectPath)){
    console.error(
      red('But path is not writable, please check folder permissions and try again.')
    )
    console.error(
      red('It is likely you do not have write permissions for the project directory.')
    )
    exitCli();
  }

  const { isEmpty } = isDirEmpty(projectPath);
  if(isEmpty){
    console.log(yellow('And will be used.'));
    return projectPath;
  }

  console.log(yellow('But it is not empty.'));
  console.log();
  
  const choice = await select({
    message: `How would you like to proceed ? ${cyan("select a choice")}:`,
    choices: [
      {
        name: "Continue",
        value: "c",
        description: "Continue the project creation like that"
      },
      {
        name: "Delete everything",
        value: "d",
        description: "Delete everything inside the directory"
      },
      {
        name: "Cancel everything",
        value: "ca",
        description: "Stop the project creation process and exit cli"
      },
    ]
  });

  console.log();

  if(choice === "ca"){
    console.log(cyan("Project creation canceled successfully."))
    exitCli();
  }
  else if(choice === "d"){
    console.log(yellow("Deleting..."));
    try{
      rmSync(projectPath, { recursive: true, force: true });
      mkdirSync(projectPath, { recursive: true });
      console.log(cyan("Deleted!"));
      return projectPath;
    }catch{
      console.log(red("Error while deleting!"));
      exitCli();
    }
  }
  else if(choice === "c"){
    return projectPath;
  }
  
}