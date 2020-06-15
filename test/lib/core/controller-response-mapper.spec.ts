import request from 'supertest'
import { createConnection } from 'typeorm'

import { config } from '../../fixture/config'
import { Server } from '../../../lib/core/server'
import {
    CustomResponseInterceptor
} from '../../fixture/controllers/response-interceptor'
import { SampleDto } from '../../fixture/dto/sample'

describe('Controller response mapper', () => {
    beforeAll(async () => {
        const server = new Server(config)
        const connection = await createConnection(config.database)
        await server.init(connection)
    })

    describe('using a response mapper', () => {
        const customInterceptor = new CustomResponseInterceptor()

        it('should decorate the response accordingly', async () => {
            const payload: SampleDto = {
                name: 'sample',
                something: 'foo',
                amount: 3
            }
            const decoratedResponse = {
                name: 'sample'
            }
            const response = customInterceptor.intercept(decoratedResponse)
            const { status, body } = await request(Server.httpServer)
                .post('/complex/decorated')
                .send(payload)

            expect(status).toEqual(201)
            expect(body).toEqual(response)
        })
    })
})
