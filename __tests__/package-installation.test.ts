import {
  expect,
  test,
  describe,
  vi,
  Mock,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
} from "vitest";
import { execSync } from "child_process";
import { log } from "console";
import { red } from "picocolors";

import {
  clearTestProjectDir,
  getCliParamAndOptions,
  getProjectTestDirPath,
  renderCli,
} from "./lib/utils";
import { installPackages } from "../src/lib/install-packages";
import { userAppConfig, userAppConfigKeys } from "../src/lib/constants";

describe("Package installation", () => {
  beforeEach(() => {
    clearTestProjectDir();
  });

  test("When user doesn't want to install packages", async () => {
    const cliArgs = getCliParamAndOptions({
      skipInstall: true,
      useDefault: true,
    });
    const { queryByText } = await renderCli(cliArgs, {
      cwd: getProjectTestDirPath(),
    });

    expect(queryByText("Installing packages...", { exact: false })).toBeNull();
  });

  test("When user want to install packages", async () => {
    const cliArgs = getCliParamAndOptions({
      useDefault: true,
    });
    const { queryByText } = await renderCli(
      cliArgs,
      {
        cwd: getProjectTestDirPath(),
      },
      "Installing packages...",
    );

    expect(
      queryByText("Installing packages...", { exact: false }),
    ).toBeTruthy();
  });
});

describe("Unit test: package installation", () => {
  let execMock = execSync as Mock;

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

  test("Show error when pck manager is not installed", () => {
    let logMock = console.log as Mock;
    execMock.mockImplementation(() => {
      throw "";
    });
    const result = installPackages("noexistpck");
    expect(result).toBe(false);
    expect(logMock).toHaveBeenCalledTimes(2);
    expect(execMock).toHaveBeenCalledTimes(1);
    expect(logMock.mock.calls[1][0]).toEqual(
      red("noexistpck is not installed"),
    );
    expect(execMock.mock.calls[0][0]).toEqual("noexistpck --version");
  });

  test("Pck manager is installed but installation failed", () => {
    let logMock = console.log as Mock;
    execMock
      .mockImplementationOnce(() => true)
      .mockImplementation(() => {
        throw "";
      });
    const result = installPackages("pnpm");
    expect(result).toBe(false);
    expect(logMock).toHaveBeenCalledTimes(2);
    expect(execMock).toHaveBeenCalledTimes(2);
    expect(logMock.mock.calls[1][0]).toEqual(
      red("Error while installing packages"),
    );
    expect(execMock.mock.calls[1][0]).toEqual("pnpm install");
  });

  test("Successfully installed pacakages", () => {
    let logMock = console.log as Mock;
    execMock.mockImplementation(() => true);
    const result = installPackages("pnpm");
    expect(result).toBe(true);
    expect(logMock).toHaveBeenCalledTimes(1);
    expect(execMock).toHaveBeenCalledTimes(2);
    expect(execMock.mock.calls[1][0]).toEqual("pnpm install");
    expect(userAppConfig.get(userAppConfigKeys.pckManager)).toEqual("pnpm");
  });
});
