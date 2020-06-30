# tsrocket 🚀
Framework for web APIs development in Typescript with scaffolding, dependency injection and some sweet decorators 🍭

## What's tsrocket?

`tsrocket` is a lightweight REST framework with dependecy injection, CLI and code scaffolding. The ideia is to offer a well defined project strucuture for API development. A `tsrocket` project has four layers: controller, model/DTO, repository and service.

### Controller layer

The Controller layer is responsible for handling incomming HTTP requests and provide a suitable response.

### Model and DTO layer

The Model layer represents the domain model. In tsrcoket, database-backed model classes are [TypeORM's](https://github.com/typeorm/typeorm) [entities](https://typeorm.io/#/entities).

DTO stands for Data Transfer Object. In `tsrocket`, DTOs represent what the controller should expect as inputs in the requests. Using DTOs, we can validate if the controller is receiving the data it's expecting, avoiding runtime errors.

### Repository layer

The Repository layer is a collection of TypeORM [custom repository](https://typeorm.io/#/custom-repository/custom-repository-extends-standard-repository). Any model manipulation or validation should be included in it.

### Service layer

All business logic of your application should reside in the Service layer. `tsrocket` has a built-in service injection inspired by [typedi](https://github.com/typestack/typedi) and [typeorm-typedi-extensions](https://github.com/typeorm/typeorm-typedi-extensions).

## Quick Start

The first thing we need to do is to install the `tsrocket` package. `tsrocket` was developed and tested for node version `>=12.14.1`

`npm install -g tsrocket`

Then, we can use tsrocket's cli `tsr` to create an application. To do so, run the following command:

`tsr new -y sample-api`

`tsrocket` will generate a project structured as follows with everything configured for your application to run in development mode.

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

This is the main file of our application and we can run it in development mode with the command `npm run start:dev`. It basically creates a database connection and tells `tsrocket` to setup your application so it can be served.

```bash
$ cd sample-api
$ npm run dev
info: listening at port 3000
```

By default, `tsrocket` uses sqlite as database. We may want to change it to run the application in production. To do so, we can update the `src/config.ts` file. The [TypeORM connection documentation](https://typeorm.io/#/connection-options) might help.

We can run `tsr -help` if we get stuck.

To disable CORS, we can use: `server.disableCors()`.

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

A TypeORM repository:

```typescript
// src/repositories/post.ts
import { EntityRepository, Repository } from "typeorm";
import User from "../models/user";

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
    /* Add you model logic inside here */
}
```

And a TypeORM migration file inside the migrations folder. To apply the migration, we can run `npm run orm migration:run`

We can run `tsr generate model --h` to get more information about `tsr` model generation:

### Service and Controller generation

After we generate the User model and its repository. We can use `tsrocket` cli to generate a service to manipulate the repository. Run `tsr g service user` to generate the following file:

```typescript
// src/services/user.ts
import { Service } from 'tsrocket'

@Service()
export default class UserService { }
```

We can use use the `@InjectRepository` decorator to inject the user repository and `@Inject` to inject another service.

```typescript
// src/services/user.ts
import { Service, InjectRepository } from 'tsrocket'
import UserRepository from '../repositories/user'
import AnotherService from './another-service'

@Service()
export default class UserService {

    @InjectRepository(UserRepository)
    private readonly repository: UserRepository
    
    @Inject(AnotherService)
    private readonly anotherService: AnotherService

}
```

It's also possible to use a factory to dynamically use a instance when injecting a service. To do so, we need to implement the `InjectableFactory` interface. This is useful when we want to use mocked services when testing for example:

```typescript
import { InjectableFactory, Service } from 'tsrocket'

class UserServiceFactory implements InjectableFactory {
    getInstance(): Object {
        return process.env['ENV'] === 'test'
            ? new MockedUserService()
            : new UserService()
    }
}

@Service(UserServiceFactory)
export default class UserService { }
```

In many aplications, we need a **service** to handle basic CRUD operations using the model repository. We can run `tsr g model -s user name:string 'email?:string'` to generate a model with its repository, migration and CRUD ready service.

If we run `tsr g model -c user name:string 'email?:string'`, besides a user service, `tsr` will also generate a CRUD **controller** with everyting configured and ready to run.

Both the flags `-s` and `-c` will create DTOs automatically.

For example:

```typescript
// src/controller/user.ts
import { Controller, Get, RestController, Params, Put, Body, Post, Inject, Delete } from 'tsrocket'
import UserService from '../services/user'
import { UserDto } from '../dtos/user'

@Controller('/users')
export default class UserController extends RestController {

    @Inject(UserService)
    private readonly userService: UserService

    @Get('/')
    index() {
        return this.userService.all()
    }

    @Get('/:id')
    find(@Params() id: string) {
        return this.userService.find(id)
    }

    @Put('/:id')
    update(
        @Params() id: string,
        @Body(UserDto) userDto: UserDto
    ) {
        this.userService.update(id, userDto)
    }

    @Post('/')
    create(@Body(UserDto) userDto: UserDto) {
        return this.userService.create(userDto)
    }

    @Delete('/:id')
    delete(@Params() id: string) {
        this.userService.delete(id)
    }

}
```

We can use the controller generator to create a controller. Running `tsr g controller user user` will generate the following file:

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

As we can see, `tsrocket` generated a controller with the user service already injected with the `@Inject` decorator. The first argument of the `tsr g controller` command is the name of the controller and any following argument will be treated as dependency injection by the `tsrocket` scaffold.

### Request handler decorators

We can use `@Get` to indicate a HTTP *get* request handler, `@Post` for a *post* handler and so on. `tsrocket` knows what HTTP status to send depending on the HTTP method and the handler response (if it returns something valid or throws an error, for instance). We need to pass a path as argument to every of these HTTP method decorators. The `@Body` and `@Params` decorators reflects [express](https://expressjs.com/en/api.html#req) *body* and *params* properties from a *Request* instance.

### Request handler argument validator 

We can decorate DTO class properties to validate and make sure that the controller handlers receive the expected data from the request. The `@Field` is used to indicate an DTO attribute. We can also use [class-validator](https://github.com/typestack/class-validator) decorators, such as `IsString` and `IsEmail` for instance.

If we need to process an incoming data, we can pass a function in the `transform` option.

```typescript
// src/dtos/user.ts
import { Field } from 'tsrocket'
import { IsEmail, IsString, IsDate } from 'class-validator'

export class UserDto {

    @Field()
    @IsString()
    name: string

    @Field()
    @IsEmail()
    email: string

    @Field({ transform: (value: string) => new Date(value) })
    @IsDate()
    birthDate: Date

    @Field({ nullable: true })
    @IsString()
    lastName?:string

}
```

### TypeORM integration

If we need to, we can run `npm run orm` to execute `typeorm` commands. For instance, we can apply the migrations by typing the following command in the terminal `npm run orm migration:run`.

### Response Interceptor

By default, `tsrocket` uses the following structure to respond all the requests:

```json
{
    "data": { },
    "error": { }
}
```

We can change this behaviour in two different ways: controller and application level.

The first step is to implement a ResponseInterceptor class:

```typescript
class CustomInterceptor implements ResponseInterceptor {

    intercept(response?: any, error?: Error) {
        console.log('Decorating the request response')

        const decoratedResponse = {
            response,
            error
        }

        return decoratedResponse
    }

}
```

So the response will be:

```json
{
    "reponse": { },
    "error": { }
}
```

To apply this interceptor to a specific controller, we can use the `@UseResponseInterceptor` decorator:

```typescript
// src/controllers/cars.ts
@UseResponseInterceptor(CustomInterceptor)
@Controller('/cars')
export default class CarController extends RestController { }
```

Note that, we only need to pass the class as argument. Internally, `tsrocket` uses its dependency injection mechanism.

Or we can use the `CustomInterceptor` in the application level. In this case, the interceptor will be attached to every controller:

```typescript
// src/server.ts
const server = new Server(config)
server.useResponseInterceptor(CustomInterceptor)
```

### Response Mapper

Sometimes we may need to filter what the controller will send as response. In `tsrocket` it's quite easy and straightforward. We only need to implement a DTO class. For example, suppose we have a user model:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

}
```

We can see that `User` has multiple properties but we want to return only the name and email. So the resulting DTO would be:

```typescript
import { Field } from 'tsrocket'

export class UserResponseDto {

    @Field()
    name: string

    @Field()
    email: string

}
```

To map a controller handler response we only need to pass the DTO class as parameter to the HTTP method decorator. `@Get` in the example below. The handler response can be either a object or an array of objects.

```typescript
@Controller('/users')
export class UserController {

    @Inject(UserService)
    private readonly userService: UserService

    @Get('/', UserResponseDto)
    listUsers() {
        return this.userService.find()
    }

}
```