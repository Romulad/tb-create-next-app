import { renderCli, waitFor } from "./lib/utils";

describe("App version", ()=>{
  test("App version is asked to the user", async ()=>{
    const { getByText, userEvent } = await renderCli(
      ["testproject", "--app-description \"my project\""]
    );
    expect(getByText("Project version", { exact: false  })).toBeTruthy();
    await userEvent.keyboard("4");
    await userEvent.keyboard("[Enter]");
  })

  test("App version is asked with default value and is optional", async ()=>{
    const { getByText, userEvent } = await renderCli(
      ["testproject", "--app-description \"my project\""]
    );
    expect(getByText("Project version: (4)", { exact: false  })).toBeTruthy();
    await userEvent.keyboard("[Enter]");
    await waitFor(1000);
    expect(getByText("Git repository", { exact: false  })).toBeTruthy();
  })
})