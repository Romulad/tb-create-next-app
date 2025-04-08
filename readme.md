# Next.js Scaffolding Tool

[![New project repo here](https://img.shields.io/badge/GitHub-Repo-blue, "New project repo")](https://github.com/dev-vizier/vizier)

`tb-create-next-app` is a lightweight scaffolding tool for Next.js projects (currently in active development).

## How to use it

You can create a new project interactively by running:

```bash
npx tb-create-next-app@latest [your-project-name]
# or
bunx tb-create-next-app [your-project-name]
# or
pnpx tb-create-next-app [your-project-name]
# or
yarn dlx tb-create-next-app [your-project-name]
```

**Note**: `yarn dlx` is available only in Yarn v2 and above.

You will then be prompted to provide the necessary input for your project setup.

Example:

```bash
npx tb-create-next-app@latest myawesomeproject
```

### Available options

```bash
usage: tb-create-next-app [projectName] [options]

Arguments:
  projectName                   Your project name

Options:
  -v, --version

        Output the current version of tb-create-next-app.

  --app-version <version?:string>

        Specify your application version. It will be set in your project's
        package.json `version` field.
        Default to '0.1.0' when running tb-create-next-app for the first time on your system.

  --app-description <description?:string>

        Description for your application, It will be set in your project's
        package.json `description` field.

  --git-repo <git-repo-url?:string>

        Git repository URL for the project. If specified, it should be a valid repository URL.
        It will be set in your project's package.json repository.url field and
        used to initialize Git if allowed.

  --pck-manager <package-manager>

        Package manager to use; can be npm, yarn, pnpm, bun or any valid
        package manager.

  --skip-git

        Specify this option to avoid git initialization

  --skip-install

        Specify this option to avoid package installation

  -h, --help

        display help for command
```

## Why this project

### Repetitive Setup Work

When starting a new project, I often copy-paste configurations from previous ones for tasks like:

- Testing environments
- Authentication (NextAuth, Clerk...)
- Linting/Formatting (ESLint, Prettier)
- Docker & CI/CD

This process is:

1. Time-consuming
2. Error-prone
3. Difficult to maintain consistency across projects

Constantly switching between projects to:

- Recall specific configurations
- Look up syntax for tools like Docker or GitHub Actions
- Verify best practices

## Solutions

### Use create-next-app

While [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) provides excellent starter templates, it has limitations:

- Rigid template structure
- No selective feature inclusion
- Limited to initial setup only

I can use it with a GitHub repo, but each project has its own needs and setup requirements.

In some projects you might want to include `A` and `C` but not `B`. In others, you may only need `A` and neither `B` nor `C`.

### Inspiration from create-next-app

Initially, I wanted to create a more flexible scaffolding tool inspired by `create-next-app`, drawing heavily from its package implementation — that’s how tb-create-next-app` was born.

Current vision:

1. **Modular Architecture**

   - Select only needed features

2. **Lifecycle Management**

   - Scaffolding → Development → Deployment

3. **Framework Agnostic Vision**

   - Future expansion to other frameworks (React, Vue, Svelte, etc.)

Think of it as a developer's vizier—handling repetitive tasks so you can focus on building.

[Explore the new project repository](https://github.com/dev-vizier/vizier)
