import { resolve } from "path";

export const testProjectDirPath = resolve(
  (() => __dirname)(),
  "..",
  "tb-testing-folder",
);
