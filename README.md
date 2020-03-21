# tsrocket
Prototype web APIs using Typescript with scaffolding.

**disclaimer:**
_tsrocket is under active development.
The scope for this project still open for changes and not every intended feature is implemented yet._
**_Contributors are welcome :)_**

`tsrocket` is designed to help developers to easily propotype web APIs with its scaffolding features.
An `tsrocket` application is structured as follows:

```
my-awesome-app/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── repositories/
│   ├── database.ts
│   └── app.ts
├── package.json
├── tsconfig.json
└── README.md
```

A `model` is basically a [TypeORM](https://github.com/typeorm/typeorm) [Entity](https://typeorm.io/#/entities).
The same is applied to `repositories`.

It's recommended that all businnes logic to reside inside the `services` folder.
A service is based on [typedi](https://github.com/typestack/typedi) dependency injection.

`tsrocket` uses [typeorm-typedi-extensions](https://github.com/typeorm/typeorm-typedi-extensions)
under the hood to integrate repositories with services.

## Quick Start

To create an application:

`tsrocket new my-awesome-app`

Type `cd my-awesome-app` and `tsrocket gen controller home` to generate a new controller called `HomeController`:

```typescript
#src/controllers/home.ts
import {
    GET,
    Context,
    Response,
    Controller
} from "tsrocket"

export default class HomeController implements Controller {

    @GET('/home')
    async index(_: Context): Promise<Response> {
        return 'Hello world from /home'
    }

}
```

Run `curl http://localhost:3000/home`:

```json
{
    "data":"Hello world from /home"
}
```

## Motivation

`tsrocket` adopts the ideia of convention over configuration and offers code generation with its cli.

_*more to come_

## Contributing

1. Clone the repository
2. Run `npm link  .` from inside the repository folder

### Commit guidelines

`tsrocket` commit message format is based on [Angular's community](https://github.com/angular/angular/blob/master/CONTRIBUTING.md).

Each commit message consists of a **header** and a **body**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
```

The **header** is mandatory and the **scope** of the header is optional.

#### Type

Must be one of the following:

* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests

### Milestone version 0.1.0

- [x] Generate the aplication barebones
- [x] Add Controller scaffolding
- [ ] Configure eslint for the project
- [ ] Add eslint scaffolding
- [ ] Add model scaffolding
- [ ] Add repository scaffolding
- [ ] Add service scaffolding
- [ ] Add API route management algorithms
- [ ] Add app management (start and stop) algorithms
- [ ] Add database migration based on model changes
- [ ] Configure semantic release
- [ ] Write tests
- [ ] Write useful guides and project documentations

_*more to come_
