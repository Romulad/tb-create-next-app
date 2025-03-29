import { dirname, resolve } from "path";
import { isDirEmpty, isDirWritable } from "./dir-utils";
import { exitCli } from "./functions";
import { existsSync, mkdirSync, rmSync } from "fs";
import { red, yellow, cyan } from "picocolors";
import { select } from "@inquirer/prompts";

export const handleDirAction = (choice: string, projectPath: string) => {
  if (choice === "cancel") {
    console.log(cyan("\nProject creation canceled successfully."));
    return false;
  } else if (choice === "delete") {
    console.log(yellow("\nDeleting..."));
    try {
      rmSync(projectPath, { recursive: true, force: true });
      mkdirSync(projectPath, { recursive: true });
      console.log(cyan("Deleted!"));
      return projectPath;
    } catch {
      console.log(red("Error while deleting!"));
      return false;
    }
  } else if (choice === "continue") {
    return projectPath;
  }
};

export default async function createProjectDir(projectName: string) {
  const projectPath = resolve(projectName);
  const projectDirPath = dirname(projectPath);

  /* Check if the parent dir is writable */
  if (!isDirWritable(projectDirPath)) {
    console.error(
      red(
        "\nThe application path is not writable, please check folder permissions and try again.",
      ),
    );
    console.error(
      red("It is likely you do not have write permissions for this folder."),
    );
    exitCli();
  }

  if (!existsSync(projectPath)) {
    mkdirSync(projectPath, { recursive: true });
    return projectPath;
  }

  console.log(yellow("\nThe project directory already exist..."));

  /* Since the project dir exist, check if it is writable too */
  if (!isDirWritable(projectPath)) {
    console.error(
      red(
        "But path is not writable, please check folder permissions and try again.",
      ),
    );
    console.error(
      red(
        "It is likely you do not have write permissions for the project directory.",
      ),
    );
    exitCli();
  }

  const { isEmpty } = isDirEmpty(projectPath);
  if (isEmpty) {
    console.log(yellow("And will be used."));
    return projectPath;
  }

  console.log(yellow("But it is not empty.\n"));

  const choice = await select({
    message: `How would you like to proceed ? ${cyan("select a choice")}:`,
    choices: [
      {
        name: "Continue",
        value: "continue",
        description: "Continue the project creation like that",
      },
      {
        name: "Delete everything",
        value: "delete",
        description: "Delete everything inside the directory",
      },
      {
        name: "Cancel everything",
        value: "cancel",
        description: "Stop the project creation process and exit cli",
      },
    ],
  });

  const result = handleDirAction(choice, projectPath);
  !result && exitCli();
  return result;
}
