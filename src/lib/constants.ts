import Conf from "conf";
import { UserInputData } from "./decalrations";


export const userAppConfig = new Conf({projectName: "tb-create-next-app"});

export const userAppConfigKeys = {
  appVersion: "app_version",
  pckManager: "pck_manager"
}

export const TEMPLATES_DIRECTORY_NAME = "templates";

export const TEMPLATE_NAMES = {
  appDefault: "app-default"
}

export const userInputData: UserInputData = {
  projectName: "",
  appDescription: "Amazing Nextjs app",
  appVersion: "0.1.0",
  gitRepoUrl: "",
  skipGit: false,
  skipInstall: false,
  pckManager: "npm",
};

export const defaultPackageJson = {
  name: "Your project name",
  version: "0.1.0",
  description: "Your app description",
  repository: {
    type: "git",
    url: "",
  },
  scripts: {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  dependencies: {
    "next": "^15.1.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
  },
  devDependencies: {
    "@eslint/eslintrc": "^3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.1.6",
    "typescript": "^5"
  }
};