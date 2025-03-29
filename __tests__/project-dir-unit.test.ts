import { mkdirSync, rmSync } from "node:fs";
import {
  describe,
  test,
  expect,
  vi,
  beforeAll,
  afterAll,
  afterEach,
  Mock,
} from "vitest";
import { cyan, yellow, red } from "picocolors";

import { handleDirAction } from "../src/lib/create-project-dir";
import { log } from "node:console";

describe("Unittest: Project directory action", () => {
  const rmMock = rmSync as Mock;
  const mkdirMock = mkdirSync as Mock;
  let logMock: Mock;

  beforeAll(() => {
    console.log = vi.fn();
    logMock = console.log as Mock;
    vi.mock("node:fs", async (originalModule) => {
      return {
        ...(await originalModule()),
        rmSync: vi.fn(),
        mkdirSync: vi.fn(),
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

  test("When user choose to cancel creation", () => {
    const result = handleDirAction("cancel", "");
    expect(result).toBe(false);
    expect(logMock).toHaveBeenCalledTimes(1);
    expect(logMock.mock.calls[0][0]).toEqual(
      cyan("\nProject creation canceled successfully."),
    );
  });

  test("When user choose to continue creation", () => {
    const result = handleDirAction("continue", "path");
    expect(result).toEqual("path");
  });

  test("When user choose to delete everything and it failed", () => {
    rmMock.mockImplementation(() => {
      throw "";
    });
    const result = handleDirAction("delete", "path");
    expect(result).toBe(false);
    expect(logMock).toHaveBeenCalledTimes(2);
    expect(rmMock).toHaveBeenCalledTimes(1);
    expect(logMock.mock.calls[0][0]).toEqual(yellow("\nDeleting..."));
    expect(logMock.mock.calls[1][0]).toEqual(red("Error while deleting!"));
  });

  test("When user choose to delete everything and it success", () => {
    rmMock.mockImplementation(() => true);
    mkdirMock.mockImplementation(() => true);
    const result = handleDirAction("delete", "path");
    expect(result).toBe("path");
    expect(logMock).toHaveBeenCalledTimes(2);
    expect(rmMock).toHaveBeenCalledTimes(1);
    expect(mkdirMock).toHaveBeenCalledTimes(1);
    expect(logMock.mock.calls[0][0]).toEqual(yellow("\nDeleting..."));
    expect(logMock.mock.calls[1][0]).toEqual(cyan("Deleted!"));
  });
});
