import { resolve } from "path";
import { render } from "cli-testing-library";
import { existsSync, mkdirSync, rmSync } from "fs";
import { testProjectDirPath } from "./constants";

export const waitFor = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Successfully");
    }, timeout);
  });
};

export const waitForCondition = (
  condition: () => boolean,
  timeout: number = 50000,
) => {
  const poolingInterval = 1000;
  return new Promise((resolve, rejected) => {
    if (condition()) resolve("Successfully");

    let timeoutSum: number = 0;
    const checker = (
      resolve: (value: unknown) => void,
      rejected: (reason: unknown) => void,
    ) => {
      if (timeoutSum >= timeout) {
        rejected(
          `Time exceed, rendering condition didn't match after ${timeoutSum / 1000}s`,
        );
      }

      timeoutSum += poolingInterval;

      setTimeout(() => {
        if (condition()) {
          resolve("Successfully");
        } else {
          checker(resolve, rejected);
        }
      }, poolingInterval);
    };
    checker(resolve, rejected);
  });
};

/**
 * @param waitForText string to wait for in the cli output before returning the render result object
 */
export const renderCli = async (
  args?: string[],
  options?: Record<string, unknown>,
  waitForText?: string,
) => {
  const cliPath = resolve("dist", "index.js");
  const renderResult = await render(
    "node",
    [cliPath, ...(args || [])],
    options,
  );

  // wait untill the cli is render: some result is visible
  const condition = () =>
    waitForText
      ? renderResult.getStdallStr().includes(waitForText)
      : renderResult
          .getStdallStr()
          .includes(
            "This utility will walk you through creating a NextJs app using app router",
          );

  await waitForCondition(condition);
  await waitFor(1000);
  return renderResult;
};

export const getProjectTestDirPath = () => {
  if (!existsSync(testProjectDirPath))
    mkdirSync(testProjectDirPath, { recursive: true });
  return testProjectDirPath;
};

export const clearTestProjectDir = (dirPath = testProjectDirPath) => {
  try {
    rmSync(dirPath, { recursive: true, force: true });
    mkdirSync(dirPath, { recursive: true });
    return true;
  } catch {
    return false;
  }
};

export const getCliParamAndOptions = ({
  projectName,
  description,
  version,
  gitRepoUrl,
  pckManager,
  skipGit,
  skipInstall,
  useDefault,
}: {
  projectName?: string;
  description?: string;
  version?: string;
  gitRepoUrl?: string;
  pckManager?: string;
  skipGit?: boolean;
  skipInstall?: boolean;
  useDefault?: boolean;
}) => {
  const options = [
    projectName ? projectName : useDefault ? "testproject" : undefined,
    description
      ? `--app-description ${description}`
      : useDefault
        ? `--app-description "my project"`
        : undefined,
    version
      ? `--app-version ${version}`
      : useDefault
        ? `--app-version "1.0.0"`
        : undefined,
    gitRepoUrl
      ? `--git-repo ${gitRepoUrl}`
      : useDefault
        ? `--git-repo "https://github.com"`
        : undefined,
    pckManager
      ? `--pck-manager ${pckManager}`
      : useDefault
        ? `--pck-manager "pnpm"`
        : undefined,
    skipGit ? "--skip-git" : undefined,
    skipInstall ? "--skip-install" : undefined,
  ].filter((option) => typeof option === "string");

  return options;
};
