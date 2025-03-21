import { describe, test, expect } from "vitest";
import { renderCli } from "./lib/utils";

describe('App package manager', ()=>{
  test('Pck manager is asked', async ()=>{
    const { findByText, userEvent } = await renderCli([
      'testproject', "--app-description \"my project\"", "--app-version \"1.0.0\"",
      "--git-repo \"test\""
    ]);
    expect(await findByText('Which package do you want to use?')).toBeTruthy();
    expect(await findByText('❯ npm')).toBeTruthy();
    expect(await findByText('yarn')).toBeTruthy();
    expect(await findByText('pnpm')).toBeTruthy();
    expect(await findByText('A widely used package manager for JavaScript')).toBeTruthy();
    await userEvent.keyboard('[ArrowDown]');
    expect(await findByText('Fast and reliable package manager for JavaScript')).toBeTruthy();
  });

  test('Pck manager with warning msg', async ()=>{
    const { findByText } = await renderCli([
      'testproject', "--pck-manager \"pckManager\""
    ]);
    expect(await findByText(`You’ve selected a different package manager than npm, yarn or pnpm`)).toBeTruthy();
  });
})