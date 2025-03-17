import { renderCli, waitFor } from "./lib/utils";

describe("App Description", ()=>{
  test("App description is asked to the user", async ()=>{
    const { getByText, userEvent } = await renderCli(["testproject"]);
    expect(getByText("Project description", { exact: false  })).toBeTruthy();
    await userEvent.keyboard("My project description");
    await userEvent.keyboard("[Enter]");
    await waitFor(1000);
    expect(getByText("Project version", { exact: false  })).toBeTruthy();
  })

  test("App description is asked and is optional", async ()=>{
    const { getByText, userEvent } = await renderCli(["testproject"]);
    expect(getByText("Project description", { exact: false  })).toBeTruthy();
    await userEvent.keyboard("[Enter]");
    await waitFor(1000);
    expect(getByText("Project version", { exact: false  })).toBeTruthy();
  })
})