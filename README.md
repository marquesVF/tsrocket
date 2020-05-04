# tsrocket 🚀
Ease up web APIs development in Typescript with scaffolding, dependency injection and some sweet decorators 🍭

## What's tsrocket?

`tsrocket` is composed of a lightweight REST framework, dependecy injection, cli and code generation. A `tsrocket` project has four layers (controllers, models, repositories and services) and it is structured as follows:

```
sample-api/
├── src/
│   ├── controllers/
│   ├── dtos/
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

### Controller layer

The Controller layer is responsible for handling incomming HTTP requests and provide a suitable response.

### DTO layer

DTO stands for Data Transfer Object. In `tsrocket`, the DTO layer is responsible to represent what the controller should expect as inputs from the requests.

### Model layer

The Model layer represents the domain model. In tsrcoket, database-backed model classes are [TypeORM's](https://github.com/typeorm/typeorm) [entities](https://typeorm.io/#/entities).

### Repository layer

The Repository layer is a collection of TypeORM [custom repository](https://typeorm.io/#/custom-repository/custom-repository-extends-standard-repository). Any model manipulation or validation should be included in it.

### Service layer

All business logic of your application should reside in the Service layer. `tsrocket` has a built-in service injection inspired by [typedi](https://github.com/typestack/typedi) and [typeorm-typedi-extensions](https://github.com/typeorm/typeorm-typedi-extensions).

## Quick Start

The first thing we need to do is to install the `tsrocket` package. It's worth notice that `tsrocket` was developed and tested for node version `>=12.14.1`

`npm install -g tsrocket`

Then, we can use tsrocket's cli `tsr` to create an application. To do so, run the following command:

`tsr new -y sample-api`

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

This is the main entrance of our application and we can run it in development mode with the command `npm run dev`. It basically creates a database connection and tells `tsrocket` to setup your application so it can be served.

```bash
$ cd sample-api
$ npm run dev
info: listening at port 3000
```

By default, `tsrocket` uses sqlite as database. We may want to change it when running the application in production. To do so, we can update the `src/config.ts` file. The [TypeORM connection documentation](https://typeorm.io/#/connection-options) might help.

We can run `tsr -help` if we get stuck.

### Model and Repository generation

Suppose we want to generate a User model with a required field 'name' and an optional 'email'. To do so, we can run  `tsr g model user name:string 'email?:string'`. The `g` command stands for `generate`.

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

To have more information on how to use `tsr` to generate a model, we can run:

```bash
$ tsr generate model --h
tsr generate model <name> [properties...]

Generate a new model with its properties

Positionals:
  name        model name                                     [string] [required]
  properties  model properties (format: <name>:<type> or <name>?:<type> for
              nullable)                                    [array] [default: []]

Options:
  --version         Show version number                                [boolean]
  -h, --help        Show help                                          [boolean]
  --controller, -c  generate controller with CRUD functionalities      [boolean]
  --service, -s     generate model service with CRUD functionalities   [boolean]
```

Properties: `<name>:<type>`, `<name>?:<type>`, `<modelName>:<hasMany|hasOne>`

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

In many aplications, we need a **service** to handle basic CRUD operations using the model repository. We can run `tsr g model -s user name:string 'email?:string'` to generate a model with its repository, migration and CRUD ready service.

If we run `tsr g model -c user name:string 'email?:string'`, besides a user service, `tsr` will also generate a CRUD **controller** with everyting configured and ready to run.

Both the flags `-s` and `-c` will create DTOs automatically.

For example:

```typescript
// src/controller/user.ts
import { Controller, Get, RestController, Params, Put, Body, Post, Inject, Delete } from 'tsrocket'
import UserService from '../services/user'
import { UserFindDto, UserDto } from '../dtos/user'

@Controller('/users')
export default class UserController extends RestController {

    @Inject(UserService)
    private readonly userService: UserService

    @Get('/')
    index() {
        return this.userService.all()
    }

    @Get('/:id')
    find(@Params(UserFindDto) findDto: UserFindDto) {
        return this.userService.find(findDto.id)
    }

    @Put('/:id')
    update(
        @Params(UserFindDto) findDto: UserFindDto,
        @Body(UserDto) userDto: UserDto
    ) {
        this.userService.update(findDto.id, userDto)
    }

    @Post('/')
    create(@Body(UserDto) userDto: UserDto) {
        return this.userService.create(userDto)
    }

    @Delete('/:id')
    delete(@Params(UserFindDto) findDto: UserFindDto) {
        this.userService.delete(findDto.id)
    }

}
```

We can use the controller generator to create an empty controller. Running `tsr g controller user user` will generate the following file:

```typescript
// src/controllers/user.ts
import { Controller, Get, RestController, Inject } from 'tsrocket'
import UserService from '../services/user'

@Controller('/users')
export default class UserController extends RestController {

    @Inject(UserService)
    private readonly userService: UserService

    @Get('/')
    index() {
        return 'Hello world from /users'
    }

}
```

As we can se, `tsrocket` generated a controller with the user service already injected with the `@Inject` decorator. The first argument of the `tsr g controller` command is the name of the controller and any following argument will be treated as dependency injection by the `tsrocket` scaffold.

We can use `@Get` to indicate a HTTP *get* request handler, `@Post` for a *post* handler and so on. `tsrocket` knows what HTTP status to send depending on the HTTP method and the handler response (if it returns something valid or throws an error, for instance). It's noticible that we need to pass a path as argument to every of these decorators. But we don't need to worry, since `tsr` is a powerfool scaffold tool and it can generate almost everything we need to build a REST api.

We can use the `tsrocket` parameter decorators to validate and make sure that the controller handlers receive the expected data from the request. The `@Body` and `@Params` decorators reflects [express](https://expressjs.com/en/api.html#req) *body* and *params* properties from a *Request* instance. Both of these decorators receive a DTO class that `tsrocket` will use to validate the received data.

For example:

```typescript
// src/dtos/user.ts
import { InputField } from 'tsrocket'

export class UserDto {

    @InputField()
    name: string

    @InputField({ nullable: true })
    lastName?:string

    @InputField()
    email: string

}

export class UserFindDto {

    @InputField()
    id: string

}
```

The `@InputField` is used to indicate an DTO attribute.

After using `tsr` to scaffold a model with its repository, service and controller, we can run `npm run dev:orm` to execute `typeorm` commands. For instance, we can run the generated migrations: `npm run dev:orm migration:run`.

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
