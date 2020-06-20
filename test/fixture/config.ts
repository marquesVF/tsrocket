import { ServerConfiguration } from '../../lib/types'

export const config: ServerConfiguration = {
    port: 1234,
    controllers: ['test/fixture/controllers/*.ts'],
    database: {
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        synchronize: true,
        logging: false
    }
}
