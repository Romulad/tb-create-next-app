import dns from "dns/promises"

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