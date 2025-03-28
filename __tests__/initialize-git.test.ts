import {
  expect,
  test,
  describe,
  vi,
  Mock,
  beforeEach,
  afterEach,
  afterAll,
  beforeAll,
} from "vitest";
import { execSync } from "child_process";
import { log } from "console";
import { red, cyan } from "picocolors";

import {
  clearTestProjectDir,
  getCliParamAndOptions,
  getProjectTestDirPath,
  renderCli,
} from "./lib/utils";
import { initializeGit } from "../src/lib/initialize-git";

describe("Git initialization", () => {
  beforeEach(() => {
    clearTestProjectDir();
  });

  test("When user doesn't want to initialize git", async () => {
    const cliArgs = getCliParamAndOptions({
      skipInstall: true,
      skipGit: true,
      useDefault: true,
    });
    const { queryByText } = await renderCli(cliArgs, {
      cwd: getProjectTestDirPath(),
    });

    expect(queryByText("Initializing git...")).toBeNull();
  });

  test("When user want to initialize git", async () => {
    const cliArgs = getCliParamAndOptions({
      skipInstall: true,
      useDefault: true,
    });
    const { queryByText } = await renderCli(
      cliArgs,
      {
        cwd: getProjectTestDirPath(),
      },
      "Initializing git...",
    );

    expect(queryByText("Initializing git...", { exact: false })).toBeTruthy();
  });
});

describe("Unit test: git initialization", () => {
  const execMock = execSync as Mock;

  beforeAll(() => {
    console.log = vi.fn();
    vi.mock("child_process", async (originalModule) => {
      return {
        ...(await originalModule()),
        execSync: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    console.log = log;
    vi.resetAllMocks();
  });

  test("Show error when git is not installed", () => {
    const logMock = console.log as Mock;
    execMock.mockImplementation(() => {
      throw "";
    });
    const result = initializeGit();
    expect(result).toBe(false);
    expect(logMock).toHaveBeenCalledTimes(2);
    expect(execMock).toHaveBeenCalledTimes(1);
    expect(logMock.mock.calls[1][0]).toEqual(
      red(`Tried to initialize git, but it can't be found, please install it.`),
    );
    expect(execMock.mock.calls[0][0]).toEqual("git --version");
  });

  test("Git is installed but initialization failed", () => {
    const logMock = console.log as Mock;
    execMock
      .mockImplementationOnce(() => true)
      .mockImplementation(() => {
        throw "";
      });
    const result = initializeGit();
    expect(result).toBe(false);
    expect(logMock).toHaveBeenCalledTimes(2);
    expect(execMock).toHaveBeenCalledTimes(2);
    expect(logMock.mock.calls[1][0]).toEqual(
      red("Error while initializing git"),
    );
    expect(execMock.mock.calls[1][0]).toEqual(
      `git init && git add . && git commit -m "Initiale commit"`,
    );
  });

  test("Successfully initialize git", () => {
    const logMock = console.log as Mock;
    execMock.mockImplementation(() => true);
    const result = initializeGit();
    expect(result).toBe(true);
    expect(logMock).toHaveBeenCalledTimes(1);
    expect(execMock).toHaveBeenCalledTimes(2);
    expect(execMock.mock.calls[1][0]).toEqual(
      `git init && git add . && git commit -m "Initiale commit"`,
    );
  });

  test("Failed to add remote origin", () => {
    const logMock = console.log as Mock;
    execMock
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => {
        throw "";
      });
    const result = initializeGit("url");
    expect(result).toBe(true);
    expect(logMock).toHaveBeenCalledTimes(2);
    expect(execMock).toHaveBeenCalledTimes(3);
    expect(logMock.mock.calls[1][0]).toEqual(
      red("Error while adding git remote origin"),
    );
    expect(execMock.mock.calls[2][0]).toEqual(`git remote add origin url`);
  });

  test("Successfully add remote origin", () => {
    const logMock = console.log as Mock;
    execMock.mockImplementation(() => true);
    const result = initializeGit("url");
    expect(result).toBe(true);
    expect(logMock).toHaveBeenCalledTimes(2);
    expect(execMock).toHaveBeenCalledTimes(3);
    expect(logMock.mock.calls[1][0]).toEqual(
      `Add git remote ${cyan("origin")} with url`,
    );
    expect(execMock.mock.calls[2][0]).toEqual(`git remote add origin url`);
  });
});
