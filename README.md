# tsrocket
Prototype web APIs using Typescript with scaffolding.

## What's tsrocket?

`tsrocket` is a framework and scaffolding tool that helps developers to easily propotype web APIs. An `tsrocket` project has four layers and is structured as follows:

```
my-awesome-project/
├── src/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── controllers/
│   ├── config.ts
│   └── server.ts
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

### Model layer

The Model layer represents the domain model. In tsrcoket, database-backed model classes are [TypeORM's](https://github.com/typeorm/typeorm) [entities](https://typeorm.io/#/entities).

For example a User model:

```typescript
// src/models/user.ts
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('user')
export default class User {

    @PrimaryColumn()
    id: string

    @Column()
    firstName: string

    @Column()
    email: string

}
```

### Repository layer

The Repository layer is a collection of TypeORM [custom repository](https://typeorm.io/#/custom-repository/custom-repository-extends-standard-repository). A repository class should contain any model manipulation logic.
For example, supose we have a model `User` and you need a method that search for users by a given first name. We could add a method called `findByFirstName(firstName: string)` inside the `UserRepository` class.

For example:

```typescript
// src/repositories/user.ts
import { EntityRepository, Repository } from 'typeorm'

import User from '../models/user'

@EntityRepository(User)
export default class UserRepository extends Repository<User> {

    async findByFirstName(firstName: string) {
        return this.findOne({ firstName })
    }

}
```

### Service layer

All business logic should reside in the Service layer. A service is based on [typedi](https://github.com/typestack/typedi) dependency injection.

`tsrocket` uses [typeorm-typedi-extensions](https://github.com/typeorm/typeorm-typedi-extensions) under the hood to integrate services and respositories.

For example, supose we want a service to handle User related logic:

```typescript
// src/services/user.ts
import { Inject, Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'

import UserRepository from '../repositories/user'

@Service()
export default class UserService {

    async find(id: string) {
        const repository = getCustomRepository(UserRepository) 
        // first we find the user by its first name
        const user = await repository.findOne({ id })

        // we can also do something with user before returning it

        return user
    }

}
```

### Controller layer

The Controller layer is responsible for handling incomming HTTP requests and provide a suitable response. For example:

```typescript
// src/controllers/user.ts
import { Controller, GET, RestController } from 'tsrocket'
import UserService from '../services/user'

@Controller('/users')
export default class UserController extends RestController {

    constructor(private users: UserService) {
        super()
    }

    @GET('/')
    async index() {
        return this.users.find()
    }

}
```

It should return something like this:

```json
{
    "data": {
        "users": [
            {
                "firstName": "Smith"
            }
        ]
    } 
}
```

## Quick Start

We can use tsrocket's cli `tsr` o create an application:

`tsr new my-awesome-project`

tsrocket will generate all the basic project files. The main function is located at `src/server.ts`:

```typescript
// src/server.ts
import { Server } from 'tsrocket'
import config from './config'

async function main() {
    const server = new Server(config)
    await server.init()

    server.listen()
}

export default main()

```

Type `cd my-awesome-project` and `tsr gen controller home` to generate a new controller named `HomeController`:

```typescript
// src/controllers/home.ts
import { Controller, GET, RestController } from 'tsrocket'

@Controller('/home')
export default class HomeController extends RestController {

    @GET('/')
    index() {
        return 'Hello world from /home'
    }

}

```

Run `yarn dev` to starts the server and execute `curl http://localhost:3000/home`:

```json
{
    "data": "Hello world from /home"
}
```

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
