import { execSync } from "child_process";

const args = process.argv.slice(2);

const npmIstalled = () => {
  try {
    execSync("npm --version");
    return true;
  } catch {
    return false;
  }
};

const runNpmScripts = (scriptName, errorMsg) => {
  if (!npmIstalled()) {
    console.error("Npm is not installed, please install it before continuing.");
    process.exit(1);
  }

  try {
    execSync(`npm run ${scriptName}`, { stdio: "inherit" });
  } catch {
    console.error(`\n${errorMsg || "Error while executing command."}`);
    process.exit(1);
  }
};

const validateCommitMsg = (commitMsg) => {
  const pattern = /^(feat|fix|test|refactor|chore|style|build):\s*\w+/;
  if (!pattern.test(commitMsg)) {
    console.log(
      "Incorrect commit message, should be in this format <type>: <message>",
    );
    process.exit(1);
  }
};

if (args.length <= 0) {
  console.log("Provide a valid command name");
  process.exit(1);
}

args.forEach((cmd, index) => {
  switch (cmd) {
    case "test":
      runNpmScripts("test", "Error while executing test.");
      break;
    case "format":
      runNpmScripts("prettier", "Error while formatting with prettier.");
      execSync("git add .");
      break;
    case "coMsg":
      validateCommitMsg(args[index + 1]);
      break;
  }
});

process.exit(0);
