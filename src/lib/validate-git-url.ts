import { execSync } from "child_process";
import { isOnline } from "./functions";
import isGitInstalled from "./git-is-installed";

type isValidGitRepoUrlReturnTye = {
  valid: boolean,
  message?: string,
  isDeconnected?: boolean
}

export const isValidGitRepoUrl = async (
  url: string
) : Promise<isValidGitRepoUrlReturnTye> => {  

  try{
    new URL(url);
  }catch{
    return {valid: false, message: "Invalid repository url"};
  }

  if(!isGitInstalled()){
    return {valid: false, message: "Git command can't be found"}; 
  }

  if(!(await isOnline())){
    return { 
      valid: false, 
      isDeconnected: true,
      message: "You need to be connected to be able to add a git repository url"};
  }

  try{
    execSync(`git ls-remote ${url}`, { stdio: "ignore" });
  }catch{
    return {valid: false, message: `Repository ${url} not found`}
  }

  return {valid: true};
}