import { useContainer, createConnection } from 'typeorm'
import { Container } from 'typedi'
import {
    SqliteConnectionOptions
} from 'typeorm/driver/sqlite/SqliteConnectionOptions'

useContainer(Container)

const DEFAULT_DATABASE =  `${process.cwd()}/database.sqlite`

// TODO it should be configurable and support other databases
export function databaseConnection() {
    const defaultConfiguration: SqliteConnectionOptions = {
        type: 'sqlite',
        database: DEFAULT_DATABASE,
        entities: ['models/*.ts']
    }

    return createConnection(defaultConfiguration)
}
