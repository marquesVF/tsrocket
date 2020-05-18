import { config } from '../../fixture/config'
import { Server } from '../../../lib/core/server'
import request from 'supertest'
import { Container } from '../../../lib/core/container'
import { SampleService } from '../../fixture/services/sampleService'
import { createConnection } from 'typeorm'

describe('Server', () => {
    beforeAll(async () => {
        const server = new Server(config)
        const connection = await createConnection(config.database)
        server.init(connection)
    })

    describe('loads the controller and handle dependecy injection', () => {
        const service: SampleService = Container.get(SampleService)

        it('should handle GET http request', async () => {
            const response = { data: service.foo() }
            const { status, body } = await request(Server.httpServer).get('/')

            expect(status).toEqual(200)
            expect(body).toEqual(response)
        })

        it('should pass parameters if argument is decorated and handle', async () => {
            const response = { data: service.find('zebra') }
            const { body } = await request(Server.httpServer).get('/zebra')

            expect(body).toEqual(response)
        })

        it('should handle PUT http request', async () => {
            const { status } = await request(Server.httpServer).put('/zebra')

            expect(status).toEqual(200)
        })

        it('should handle POST http request', async () => {
            const { status } = await request(Server.httpServer).post('/')

            expect(status).toEqual(201)
        })

        it('should handle DELETE http request', async () => {
            const { status } = await request(Server.httpServer).delete('/zebra')

            expect(status).toEqual(200)
        })
    })
})
