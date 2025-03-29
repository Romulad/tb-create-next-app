import { chmodSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { describe, test, expect } from "vitest";

import {
  clearTestProjectDir,
  getCliParamAndOptions,
  getProjectTestDirPath,
  renderCli,
  waitFor,
} from "./lib/utils";

describe("Project directories checks", () => {
  test("Show error and exit when project parent is not writtable", async () => {
    const projectDirPath = getProjectTestDirPath();
    const cliArgs = getCliParamAndOptions({ useDefault: true });
    chmodSync(projectDirPath, 0o555);

    const { getStdallStr, hasExit } = await renderCli(
      cliArgs,
      {
        cwd: projectDirPath,
      },
      "The application path is not writable, please check folder permissions and try again",
    );

    expect(
      getStdallStr().includes(
        "It is likely you do not have write permissions for this folder",
      ),
    ).toBeTruthy();
    expect(hasExit).toThrow();

    chmodSync(projectDirPath, 0o777);
  });

  test("Show error when project path exist and not writable", async () => {
    const projectDirPath = getProjectTestDirPath();
    const projectPath = join(projectDirPath, "testproject");
    mkdirSync(projectPath, { recursive: true });
    chmodSync(projectPath, 0o555);
    const cliArgs = getCliParamAndOptions({
      useDefault: true,
      projectName: "testproject",
    });

    const { getStdallStr, hasExit } = await renderCli(
      cliArgs,
      {
        cwd: projectDirPath,
      },
      "The project directory already exist...",
    );

    expect(
      getStdallStr().includes(
        "But path is not writable, please check folder permissions and try again",
      ),
    ).toBeTruthy();
    expect(
      getStdallStr().includes(
        "It is likely you do not have write permissions for the project directory",
      ),
    ).toBeTruthy();
    expect(hasExit).toThrow();

    chmodSync(projectPath, 0o777);
  });

  test("Project dir and path exist and is writable, project path is empty", async () => {
    clearTestProjectDir();
    const projectDirPath = getProjectTestDirPath();
    const projectPath = join(projectDirPath, "testproject");
    mkdirSync(projectPath, { recursive: true });
    const cliArgs = getCliParamAndOptions({
      useDefault: true,
      projectName: "testproject",
      skipGit: true,
      skipInstall: true,
    });

    const { getStdallStr } = await renderCli(
      cliArgs,
      {
        cwd: projectDirPath,
      },
      "The project directory already exist...",
    );

    expect(getStdallStr().includes("And will be used")).toBeTruthy();
  });

  test("Project dir and path exist and is writable, project path is not empty", async () => {
    clearTestProjectDir();
    const projectDirPath = getProjectTestDirPath();
    const projectPath = join(projectDirPath, "testproject/examplefolder");
    mkdirSync(projectPath, { recursive: true });
    const cliArgs = getCliParamAndOptions({
      useDefault: true,
      projectName: "testproject",
      skipGit: true,
      skipInstall: true,
    });

    const { queryByText, getStdallStr, userEvent } = await renderCli(
      cliArgs,
      {
        cwd: projectDirPath,
      },
      "The project directory already exist...",
    );

    expect(queryByText("But it is not empty", { exact: false })).toBeTruthy();
    expect(
      queryByText("How would you like to proceed", { exact: false }),
    ).toBeTruthy();
    expect(queryByText("Continue", { exact: false })).toBeTruthy();
    expect(queryByText("Delete everything", { exact: false })).toBeTruthy();
    expect(queryByText("Cancel everything", { exact: false })).toBeTruthy();

    userEvent.keyboard("[ArrowDown]");
    await waitFor(1000);
    expect(
      queryByText("Delete everything inside the directory", { exact: false }),
    ).toBeTruthy();

    userEvent.keyboard("[ArrowDown]");
    await waitFor(1000);
    expect(
      queryByText("Stop the project creation process and exit cli", {
        exact: false,
      }),
    ).toBeTruthy();

    userEvent.keyboard("[Enter]");
    await waitFor(1000);

    expect(
      getStdallStr().includes("Project creation canceled successfully"),
    ).toBeTruthy();
  });
});
