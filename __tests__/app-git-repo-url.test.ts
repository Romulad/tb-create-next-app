import { describe, test, expect, vi, Mock } from "vitest";

import { renderCli, waitFor } from "./lib/utils";
import { isOnline } from "../src/lib/functions";
import { isValidGitRepoUrl } from "../src/lib/validate-git-url";
import { execSync } from "child_process";

vi.mock("child_process", async (originamModule) => {
  return {
    ...(await originamModule()),
    execSync: vi.fn(),
  };
});
vi.mock("../src/lib/functions", async (originamModule) => {
  return {
    ...(await originamModule()),
    isOnline: vi.fn(),
  };
});

describe("Project git repo url", () => {
  test("Ask for git repo url", async () => {
    const { findByText } = await renderCli([
      "testproject",
      '--app-description "my project"',
      '--app-version "1.0.0"',
    ]);
    expect(await findByText("Git repository url")).toBeTruthy();
  });

  test("Ask for git repo url but it optional", async () => {
    const { findByText, userEvent } = await renderCli([
      "testproject",
      '--app-description "my project"',
      '--app-version "1.0.0"',
    ]);
    expect(await findByText("Git repository url")).toBeTruthy();
    await userEvent.keyboard("[Enter]");
    await waitFor(1000);
    expect(await findByText("Which package do you want to use?")).toBeTruthy();
  });

  test("Ask for git repo url: Invalid url", async () => {
    const { findByText, userEvent, queryByText } = await renderCli([
      "testproject",
      '--app-description "my project"',
      '--app-version "1.0.0"',
    ]);
    expect(await findByText("Git repository url")).toBeTruthy();
    await userEvent.keyboard("novalidurl");
    await userEvent.keyboard("[Enter]");
    expect(await findByText("Invalid repository url")).toBeTruthy();
    expect(
      queryByText("Which package do you want to use", { exact: false }),
    ).toBeNull();
  });

  test("Validate git repo from cli: Invalid url", async () => {
    const { queryByError } = await renderCli([
      "testproject",
      '--git-repo "invalidurl"',
    ]);
    expect(
      queryByError("Invalid repository url", { exact: false }),
    ).toBeTruthy();
  });
});

describe("Unit test: Project git repo url", () => {
  test("Ask for git repo url: Git not installed", async () => {
    //@ts-ignore;
    execSync.mockImplementationOnce(() => {
      throw "Error";
    });
    const isValid = await isValidGitRepoUrl("https://github.com/");
    expect(isValid.valid).toBeFalsy();
    expect(isValid.message).toEqual("Git command can't be found");
  });

  test("Ask for git repo url: Valid Url but not connected", async () => {
    //@ts-ignore;
    isOnline.mockResolvedValue(false);
    const isValid = await isValidGitRepoUrl("https://github.com/");
    expect(isValid.isDeconnected).toBeTruthy();
    expect(isValid.message).toEqual(
      "You need to be connected to be able to add a git repository url",
    );
  });

  test("Ask for git repo url: Repository not found", async () => {
    //@ts-ignore;
    isOnline.mockResolvedValue(true);
    (execSync as Mock)
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => {
        throw "Error";
      });
    const isValid = await isValidGitRepoUrl("https://github.com/Romulad");
    expect(isValid.valid).toBeFalsy();
    expect(isValid.message).toEqual(
      `Repository https://github.com/Romulad not found`,
    );
  });

  test("Ask for git repo url: Valid case", async () => {
    //@ts-ignore;
    isOnline.mockResolvedValue(true);
    //@ts-ignore;
    execSync.mockImplementation(() => true);
    const isValid = await isValidGitRepoUrl(
      "https://github.com/Romulad/web-chat-app",
    );
    expect(isValid.valid).toBeTruthy();
    expect(isValid.message).toBeUndefined();
  });
});
