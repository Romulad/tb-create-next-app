import { describe, test, expect, vi } from "vitest";
import { renderCli, waitFor } from "./lib/utils";
import { execSync } from "child_process";
import { isOnline } from "../src/lib/functions"

// TODO: test case for git not installed and git ls-remote mock with failure and success cases

vi.mock("child_process");
vi.mock("../src/lib/functions");


describe('Project git repo url', () => {
  test("Ask for git repo url", async () => {
    const { findByText } = await renderCli([
      'testproject', "--app-description \"my project\"", "--app-version \"1.0.0\""
    ]);
    expect(await findByText('Git repository url')).toBeTruthy();
  });

  test("Ask for git repo url but it optional", async () => {
    const { findByText, userEvent } = await renderCli([
      'testproject', "--app-description \"my project\"", "--app-version \"1.0.0\""
    ]);
    expect(await findByText('Git repository url')).toBeTruthy();
    await userEvent.keyboard("[Enter]");
    await waitFor(1000);
    expect(await findByText('Which package do you want to use?')).toBeTruthy();
  });

  test("Ask for git repo url: Invalid url", async () => {
    const { findByText, userEvent } = await renderCli([
      'testproject', "--app-description \"my project\"", "--app-version \"1.0.0\""
    ]);
    expect(await findByText('Git repository url')).toBeTruthy();
    await userEvent.keyboard("novalidurl");
    await userEvent.keyboard("[Enter]");
    expect(await findByText('Invalid repository url')).toBeTruthy();
  });

  test("Ask for git repo url: Valid Url but not connected", async () => {
    //@ts-ignore
    isOnline.mockResolvedValue(false);
    const { findByText, userEvent } = await renderCli([
      'testproject', "--app-description \"my project\"", "--app-version \"1.0.0\""
    ]);
    expect(await findByText('Git repository url')).toBeTruthy();
    await userEvent.keyboard(
      "http://h", { keyboardMap: [
        {code: "h", hex: "h"},
        {code: "t", hex: "t"},
        {code: "p", hex: "p"},
        {code: ":", hex: ":"},
        {code: "/", hex: "/"},
    ]});
    await userEvent.keyboard("[Enter]");
    expect(await findByText('Which package do you want to use?')).toBeTruthy();
  });

  test("Validate git repo from cli: Valid Url but not connected", async () => {
    const { findByText } = await renderCli([
      'testproject', "--git-repo \"https://github.com\""
    ]);
    expect(await findByText('You need to be connected to be able to add a git repository url')).toBeTruthy();
  });

  test("Validate git repo from cli: Invalid url", async () => {
    const { queryByError } = await renderCli([
      'testproject', "--git-repo \"invalidurl\""
    ]);
    expect(queryByError('Invalid repository url', { exact: false })).toBeTruthy();
  });
});
