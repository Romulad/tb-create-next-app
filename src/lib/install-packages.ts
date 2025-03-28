import { cyan } from "picocolors";

import { execCmdWithError } from "./functions";
import { userAppConfig, userAppConfigKeys } from "./constants";

export const installPackages = (pckManager: string) => {
  console.log(cyan("\nInstalling packages..."));

  /* Check if the package manager is installed */
  if (
    execCmdWithError(
      `${pckManager} --version`,
      `${pckManager} is not installed`,
      "ignore",
    )
  ) {
    const installed = execCmdWithError(
      `${pckManager} install`,
      `Error while installing packages`,
      "inherit",
    );
    installed && userAppConfig.set(userAppConfigKeys.pckManager, pckManager);
    return installed;
  }

  return false;
};
