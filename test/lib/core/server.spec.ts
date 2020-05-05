import { config } from '../../fixture/config'
import { Server } from '../../../lib/core/server'
import { createConnection, Connection } from 'typeorm'
import request from 'supertest'
import { Container } from '../../../lib/core/container'
import { SampleService } from '../../fixture/services/sampleService'

describe('Server', () => {
    beforeEach(async () => {
        const connection = await createConnection(config.database)
        const server = new Server(config)
        server.init(connection)
    })

    afterEach(async () => {
        const connection: Connection = Container.get('connection')
        await connection.close()
    })

    describe('tsrocket loads the controller and handle dependecy injection', () => {
        it('get /', async () => {
            const service: SampleService = Container.get(SampleService)
            const response = { data: service.foo() }
            const res = await request(Server.httpServer).get('/')

            expect(res.status).toEqual(200)
            expect(res.body).toEqual(response)
        })
    })
})
