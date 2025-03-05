import { execSync } from "child_process";
import dns from "dns/promises";
import { red } from "picocolors";

export function exitCli(){
  process.exit(1);
}

export async function isOnline(){
  try{
    await dns.lookup('nodejs.org');
    return true;
  }catch{
    return false;
  }
}

export function execCmdWithError(
  cmd: string,
  errorMsg: string,
  stdio: "inherit" | "ignore" | "overlapped" | "pipe" = "inherit"
){
  try{
    execSync(cmd, { stdio });
    return true;
  }catch{
    console.log(red(errorMsg));
    return false;
  }
}

export function isValidPckManager(pckManager: string){
  return pckManager.toLowerCase() === "npm" ||
        pckManager.toLowerCase() === "pnpm" ||
        pckManager.toLowerCase() === "yarn"
}