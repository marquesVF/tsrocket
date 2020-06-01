## Setting up the development environment

1. Clone the repository.
2. Run `cd tsrocket && npm link  .`
3. Inside another directory, run `tsr new -y test-project` to create a `tsrocket` project, and `cd test-project && npm link tsrocket` for you to test your chances in `tsrocket` source code.

You should run `npm run test` and `npm run lint` before creating a pull request.

### Commit guidelines

`tsrocket` commit message format is based on [Angular's community](https://github.com/angular/angular/blob/master/CONTRIBUTING.md).

Each commit message consists of a **header** and a **body**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
```

**header** is mandatory and **scope** of the header is optional.

**type** must be one of the following:

* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests

**body** is optional and should include relevant informations about the changes being made.