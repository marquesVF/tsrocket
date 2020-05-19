import { ServerConfiguration } from '../../lib/types'

export const config: ServerConfiguration = {
    port: 1234,
    constrollers: ['test/fixture/controllers/*.ts'],
    database: {
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        synchronize: true,
        logging: false
    }
}
