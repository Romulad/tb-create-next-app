import { execSync } from "child_process";


export default function isGitInstalled(){
  try{
    execSync("git --version", { stdio: "ignore" });
    return true;
  }catch{
    return false;
  }
}