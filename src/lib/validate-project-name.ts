import validate from "validate-npm-package-name";

type isValidProjectNameReturnType = boolean | string[];

export const isValidProjectName = (
  projectName: string
) : isValidProjectNameReturnType => {
  const result = validate(projectName);

  if(result.validForNewPackages) return true;

  const warningErrorMsg = [
    ...(result.errors || []), 
    ...(result.warnings || [])
  ];

  return warningErrorMsg;
}