/* eslint-disable max-len */
import request from 'supertest'
import { createConnection } from 'typeorm'

import { config } from '../../fixture/config'
import { Server } from '../../../lib/core/server'
import {
    DefaultResponseInterceptor
} from '../../../lib/core/defaults/default-response-interceptor'
import { SampleDto } from '../../fixture/dto/sample'
import { ErrorType } from '../../../lib/core/types/validation'
import { ValidationError } from '../../../lib/core/errors/validation'

describe('Controller body validation', () => {
    beforeAll(async () => {
        const server = new Server(config)
        const connection = await createConnection(config.database)
        await server.init(connection)
    })

    describe('loads the controller and handle dependecy injection', () => {
        const defaultInterceptor = new DefaultResponseInterceptor()

        it('should handle POST http request and validate its payload', async () => {
            const payload: SampleDto = {
                name: 'sample',
                something: 'foo',
                amount: 3
            }
            const response = defaultInterceptor.intercept(payload)
            const { status, body } = await request(Server.httpServer)
                .post('/complex')
                .send(payload)

            expect(status).toEqual(201)
            expect(body).toEqual(response)
        })

        describe('fields with wrong type', () => {
            const payload = {
                name: 'sample',
                something: 'foo',
                amount: '3'
            }

            it('should return a validation error specifying which field is wrong', async () => {
                const error: ValidationError = {
                    name: ErrorType.TypeValidation,
                    message: 'amount must be a number conforming to the specified constraints'
                }
                const response = defaultInterceptor.intercept(undefined, [error])
                const { status, body } = await request(Server.httpServer)
                    .post('/complex')
                    .send(payload)

                expect(status).toEqual(400)
                expect(body).toEqual(response)
            })
        })

        describe('missing field', () => {
            const payload = {
                name: 'sample',
                amount: 3
            }

            it('should return a validation error specifying which field is missing', async () => {
                const error: ValidationError = {
                    name: ErrorType.MissingField,
                    message: `'something' field is missing`
                }
                const response = defaultInterceptor.intercept(undefined, [error])
                const { status, body } = await request(Server.httpServer)
                    .post('/complex')
                    .send(payload)

                expect(status).toEqual(400)
                expect(body).toEqual(response)
            })
        })

        describe('field transformation', () => {
            const payload = {
                name: 'sample',
                something: 'foo',
                amount: 3,
                documentNumber: '1111-55'
            }

            it('should apply the `transform` method', async () => {
                const { status, body } = await request(Server.httpServer)
                    .post('/complex')
                    .send(payload)

                expect(status).toEqual(201)
                expect(body.data.documentNumber).toEqual(['1111', '55'])
            })
        })
    })
})
