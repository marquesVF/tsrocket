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
│   ├── models/
│   ├── services/
│   ├── repositories/
│   ├── routes.ts
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

_*more to come_

## Usage

To create an application:

`rockets new my-awesome-app`

_*more to come_

## Motivation

`tsrocket` adopts the ideia of convention over configuration and offers code generation with its cli.

_*more to come_

### Guidelines

*coming soon*

## Contributing

1. Clone the repository
2. Run `npm link  .` from inside the repository folder
3. Run `npx rockets new <APP NAME>`

### Milestone version 0.1.0

- [x] Generate the aplication barebones
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
