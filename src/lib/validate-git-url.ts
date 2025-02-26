import { execSync } from "child_process";
import { isOnline } from "./functions";

type isValidGitRepoUrlReturnTye = 
 | {
  valid: true,
}
| {
  valid: false,
  message: string
}

export const isValidGitRepoUrl = (
  url: string
) : isValidGitRepoUrlReturnTye => {  

  if(!isOnline){
    return { valid: false, message: "Please check your connectivity"};
  }

  try{
    new URL(url);
  }catch{
    return {valid: false, message: "Invalid repository url"};
  }

  try{
    execSync(`git ls-remote ${url}`, { stdio: "ignore" });
  }catch{
    return {valid: false, message: `Repository ${url} not found`}
  }

  return {valid: true};
}