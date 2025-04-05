# Next.js Scaffolding Tool

[![New project repo here](https://img.shields.io/badge/GitHub-Repo-blue)](https://github.com/dev-vizier/vizier)

`tb-create-next-app` is a lightweight scaffolding tool for Next.js projects (currently in active development).

## Why?

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

Initially, I wanted to create a more flexible scaffolding tool inspired by `create-next-app`, drawing heavily from their package implementation, that's `tb-create-next-app`.

Current vision:

1. **Modular Architecture**

- Select only needed features

2. **Lifecycle Management**

- Scaffolding → Development → Deployment

3. **Framework Agnostic Vision**

- Future expansion to other frameworks (React, Vue, Svelte, etc.)

Think of it as a developer's vizier—handling tedious tasks so you can focus on building.

[Explore the new project repository](https://github.com/dev-vizier/vizier)
