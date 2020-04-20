# tsrocket 🚀
Ease up web APIs development in Typescript with scaffolding, dependency injection and some sweet decorators 🍭

## What's tsrocket?

`tsrocket` is composed of a lightweight REST framework, dependecy injection, cli and code generation. An `tsrocket` project has four layers (controllers, models, repositories and services) and it is structured as follows:

```
sample-api/
├── src/
│   ├── controllers/
│   ├── migrations/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── config.ts
│   └── server.ts
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

### Model layer

The Model layer represents the domain model. In tsrcoket, database-backed model classes are [TypeORM's](https://github.com/typeorm/typeorm) [entities](https://typeorm.io/#/entities).

### Repository layer

The Repository layer is a collection of TypeORM [custom repository](https://typeorm.io/#/custom-repository/custom-repository-extends-standard-repository).

### Service layer

All business logic of your application should reside in the Service layer. `tsrocket` has a built-in service injection inspired by [typedi](https://github.com/typestack/typedi) and [typeorm-typedi-extensions](https://github.com/typeorm/typeorm-typedi-extensions).

### Controller layer

The Controller layer is responsible for handling incomming HTTP requests and provide a suitable response.

## Quick Start

We can use tsrocket's cli `tsr` to create an application. To do so, run the following command:

`tsr new sample-api`

`tsrocket` will generate the project folder structure and basic files for your application to run.

If we open the file `src/server.ts`:

```typescript
// src/server.ts
import { Server } from 'tsrocket'
import config from './config'
import { createConnection } from 'typeorm'

async function main() {
    const connection = await createConnection(config.database)
    const server = new Server(config)
    await server.init(connection)

    server.listen()
}

export default main()
```

This is the main entrance of our application and we can run it in development mode with the command `yarn dev`. It basically creates a database connection and tells `tsrocket` to setup your application so it can be served.

```bash
$ cd sample-api
$ yarn dev
yarn run v1.22.0
$ ts-node-dev --respawn --transpileOnly src/server.ts
Using ts-node version 8.8.2, typescript version 3.8.3
info: listening at port 3000
```

By default, `tsrocket` uses sqlite as database. We may want to change it when running the application in production. To do so, we can update the `src/config.ts` file. The [TypeORM connection documentation](https://typeorm.io/#/connection-options) might help.

We can run `tsr -help` if we get stuck.

### Model and Repository generation

Suppose we want to generate a User model with a required field 'name' and an optional 'email'. To do so, we can run  `tsr g model User 'name:string' 'email?:string'`. The `g` command stands for `generate`.

`tsrocket` will generate a TypeORM entity:

```typescript
// src/models/user.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ nullable:true })
    email?: string

}
```

A TypeORM repository also:

```typescript
// src/repositories/post.ts
import { EntityRepository, Repository } from "typeorm";
import User from "../models/user";

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
    /* Add you model logic inside here */
}

```

We can find a TypeORM migration file inside the migrations folder.

After we generate the User model and its repository. We can use `tsrocket` cli to generate a service to manipulate the repository. Run `tsr g service user` to generate the following file:

```typescript
// src/services/user.ts
import { Service } from 'tsrocket'

@Service()
export default class UserService {

}
```

We can use use the `@InjectRepository` decorator to inject the user repository:

```typescript
// src/services/user.ts
import { Service, InjectRepository } from 'tsrocket'
import UserRepository from '../repositories/user'

@Service()
export default class UserService {

    @InjectRepository(UserRepository)
    private readonly repository: UserRepository
    
}

```

We can use the controller generator to create a User controller. Running `tsr g controller user user` will generate the following file:

```typescript
import { Controller, GET, RestController, Inject } from 'tsrocket'
import UserService from '../services/user'

@Controller('/user')
export default class UserController extends RestController {

    @Inject(UserService)
    private readonly userService: UserService

    @GET('/')
    index() {
        return 'Hello world from /user'
    }

}
```

As we can se, `tsrocket` generated a controller with the user service already included with the `@Inject` decorator. The first argument of the `tsr g controller` command is the name of the controller and any following argument will be treated as dependency injection by the `tsrocket` code generator.

## Contributing

1. Clone the repository.
2. Run `cd tsrocket && npm link  .` to use the cloned repository dependency by another project.
3. Inside another directory, run `tsr new -y test-project` to create a `tsrocket` project, and `cd test-project && npm link tsrocket` for you to test your chances in the `tsrocke` source code.

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
