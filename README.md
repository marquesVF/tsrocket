# rockeTS
Prototype web APIs using Typescript with scaffolding.

**disclaimer:**
_rockeTS is under active development.
The scope for this project still open for changes and not every intended feature is implemented yet._
**_Contributors are welcome :)_**

`rockeTS` is designed to help developers to easily propotype web APIs with its scaffolding features.
An `rockeTS` application is structured as follows:

```
my-awesome-app/
├── src/
│   ├── models/
│   ├── services/
│   └── repositories/
├── routes.ts
├── database.ts
└── app.ts
```

A `model` is basically a [TypeORM](https://github.com/typeorm/typeorm) [Entity](https://typeorm.io/#/entities).
The same is applied to `repositories`.

It's recommended that all businnes logic to reside inside the `services` folder.
A service is based on [typedi](https://github.com/typestack/typedi) dependency injection.

rockeTS uses [typeorm-typedi-extensions](https://github.com/typeorm/typeorm-typedi-extensions)
under the hood to integrate repositories with services.

_*more to come_

## Usage

To create an application:

`rockets new my-awesome-application`

_*more to come_

## Motivation

`rockeTS` adopts the ideia of convention over configuration and offers code generation with its cli.

_*more to come_

### Guidelines

*coming soon*

## Contributing

*coming soon*
