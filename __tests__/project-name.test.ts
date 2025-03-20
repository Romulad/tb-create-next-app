import { describe, test, expect } from "vitest";
import { renderCli, waitFor } from "./lib/utils";


describe('Project name', () => {
    test("Ask for project name when it's not specified", async () => {
        const { findByText } = await renderCli();
        expect(await findByText('What is your project name')).toBeTruthy();
    });

    test("Validate input project name: Url friendly", async () => {
        const { userEvent, findByText } = await renderCli();
        await userEvent.keyboard("test project name");
        await userEvent.keyboard("[Enter]");
        await waitFor(1000);
        await findByText("name can only contain URL-friendly characters");
    });
    
    test("Validate input project name: No capital letters", async () => {
        const { userEvent, findByText } = await renderCli();
        await userEvent.keyboard("testProject");
        await userEvent.keyboard("[Enter]");
        await waitFor(1000);
        expect(await findByText('name can no longer contain capital letters')).toBeTruthy();
    });

    test("Valide input project name", async () => {
        const { userEvent, queryByText } = await renderCli();
        await userEvent.keyboard("testproject");
        await userEvent.keyboard("[Enter]");
        await waitFor(1000);
        expect(queryByText('Project description', { exact: false })).toBeTruthy();
    });

    test("Validate project name from cli", async () => {
        const { getStdallStr } = await renderCli(["testProject"]);
        expect(getStdallStr().includes('name can no longer contain capital letters')).toBeTruthy();
    });
});
