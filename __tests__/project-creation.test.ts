import { describe, test, expect } from "vitest";
import { join } from "path";
import { glob } from "fast-glob";
import { readFileSync } from "fs";

import {
  clearTestProjectDir,
  getProjectTestDirPath,
  renderCli,
} from "./lib/utils";
import { defaultPackageJson } from "../src/lib/constants";

describe("Project creation", () => {
  test("Project successfully created with expected files", async () => {
    /* Clear the test directory to start from an empty structure */
    clearTestProjectDir();
    const projectParentPah = getProjectTestDirPath();
    const projectName = "testproject";
    const projectPath = join(projectParentPah, projectName);
    const expectFilePaths = [
      ".env.local",
      ".gitignore",
      "README.md",
      "next-env.d.ts",
      "next.config.ts",
      "package.json",
      "tsconfig.json",
      "app/globall.css",
      "app/layout.tsx",
      "app/page.tsx",
    ];

    const { findByText } = await renderCli(
      [
        projectName,
        '--app-description "my project"',
        '--app-version "1.0.0"',
        '--git-repo "https://github.com/Romulad/web-chat-app"',
        '--pck-manager "pnpm"',
        "--skip-git",
        "--skip-install",
      ],
      { cwd: projectParentPah },
      `Nextjs project named ${projectName} created successfully`,
    );

    const filePaths = await glob("**", {
      cwd: projectPath,
      dot: true,
    });

    expectFilePaths.forEach((filePath) => {
      expect(filePaths.includes(filePath)).toBeTruthy();
    });
    expect(
      await findByText(
        `Nextjs project named ${projectName} created successfully`,
      ),
    ).toBeTruthy();

    const packageJsonContent: typeof defaultPackageJson = JSON.parse(
      readFileSync(join(projectPath, "package.json")).toString(),
    );
    expect(packageJsonContent.name).toEqual(projectName);
    expect(packageJsonContent.description).toEqual("my project");
    expect(packageJsonContent.version).toEqual("1.0.0");
    expect(packageJsonContent.repository).toEqual({
      type: "git",
      url: "https://github.com/Romulad/web-chat-app",
    });
    expect(packageJsonContent.dependencies).toEqual({
      next: "^15.0.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    });
  });
});
