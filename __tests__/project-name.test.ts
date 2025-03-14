import { renderCli } from "./lib"


describe('Project name', () => {
  test("Ask for project name when it's not specified", async () => {
    const { getStdallStr } = await renderCli();

    console.log(getStdallStr())
  })
})
