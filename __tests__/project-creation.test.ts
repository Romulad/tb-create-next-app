import { getProjectTestDirPath, renderCli } from "./lib/utils";


describe('Project creation', ()=>{
  test('Project creation with git and npm', async ()=>{
    const {getStdallStr} = await renderCli([
      'testproject', "--app-description \"my project\"", "--app-version \"1.0.0\"",
      "--git-repo \"https://github.com\"", "--pck-manager \"npm\""
    ], { cwd: getProjectTestDirPath() });
  })
})