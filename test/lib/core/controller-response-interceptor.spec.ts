import request from 'supertest'
import { createConnection } from 'typeorm'

import { config } from '../../fixture/config'
import { Server } from '../../../lib/core/server'
import {
    CustomResponseInterceptor
} from '../../fixture/controllers/response-interceptor'
import { SampleDto } from '../../fixture/dto/sample'

describe('Controller response interceptor', () => {
    beforeAll(async () => {
        const server = new Server(config)
        const connection = await createConnection(config.database)
        await server.init(connection)
    })

    describe('using a custom response interceptor', () => {
        const customInterceptor = new CustomResponseInterceptor()

        it('should decorate the response accordingly', async () => {
            const payload: SampleDto = {
                name: 'sample',
                something: 'foo',
                amount: 3
            }
            const response = customInterceptor.intercept(payload)
            const { status, body } = await request(Server.httpServer)
                .post('/response-interceptor')
                .send(payload)

            expect(status).toEqual(201)
            expect(body).toEqual(response)
        })
    })
})
