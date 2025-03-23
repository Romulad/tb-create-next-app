import { accessSync, existsSync, readdirSync, type PathLike } from "node:fs";
import { W_OK } from "node:constants";

export const isDirWritable = (dirPath: PathLike) => {
  try {
    accessSync(dirPath, W_OK);
    return true;
  } catch (error) {
    return false;
  }
};

type isDirEmptyRType =
  | {
      isEmpty: boolean;
      path?: undefined;
    }
  | {
      isEmpty: boolean;
      path: string[];
    };
export const isDirEmpty = (dirPath: PathLike): isDirEmptyRType => {
  const filePaths = readdirSync(dirPath);

  if (filePaths.length <= 0) {
    return { isEmpty: true };
  }

  return { isEmpty: false, path: filePaths };
};
