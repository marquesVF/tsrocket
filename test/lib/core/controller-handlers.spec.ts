import request from 'supertest'
import { createConnection } from 'typeorm'

import { config } from '../../fixture/config'
import { Server } from '../../../lib/core/server'
import { Container } from '../../../lib/core/container'
import { SampleService } from '../../fixture/services/sample'
import {
    DefaultResponseInterceptor
} from '../../../lib/core/defaults/default-response-interceptor'

describe('Controller handlers', () => {
    beforeAll(async () => {
        const server = new Server(config)
        const connection = await createConnection(config.database)
        await server.init(connection)
    })

    describe('loads the controller and handle dependecy injection', () => {
        const service: SampleService = Container.get(SampleService)
        const defaultInterceptor = new DefaultResponseInterceptor()

        it('should handle GET http request', async () => {
            const response = defaultInterceptor.intercept(service.foo())
            const { status, body } = await request(Server.httpServer).get('/')

            expect(status).toEqual(200)
            expect(body).toEqual(response)
        })

        it('should process and validate the params argument', async () => {
            const response = defaultInterceptor
                .intercept(service.find('zebra'))
            const { body } = await request(Server.httpServer).get('/zebra')

            expect(body).toEqual(response)
        })

        // eslint-disable-next-line max-len
        it('should handle PUT http request with the id parameter as string', async () => {
            const response = defaultInterceptor
                .intercept('put method with zebra')
            const { status, body } = await request(Server.httpServer)
                .put('/zebra')

            expect(status).toEqual(200)
            expect(body).toEqual(response)
        })

        it('should handle DELETE http request', async () => {
            const { status } = await request(Server.httpServer).delete('/zebra')

            expect(status).toEqual(200)
        })
    })
})
