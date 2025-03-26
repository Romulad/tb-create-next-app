import { describe, test } from "vitest";
import {
  clearTestProjectDir,
  getProjectTestDirPath,
  renderCli,
  waitFor,
} from "./lib/utils";

describe("Project creation", () => {
  test("Full project creation after specifying the last input: ", async () => {
    /* Clear the test directory to start from a clean structure */
    clearTestProjectDir();

    const { getStdallStr } = await renderCli(
      [
        "testproject",
        '--app-description "my project"',
        '--app-version "1.0.0"',
        '--git-repo "https://github.com"',
        '--pck-manager "npm"',
      ],
      { cwd: getProjectTestDirPath() },
    );

    console.log(getStdallStr());
  });
});
