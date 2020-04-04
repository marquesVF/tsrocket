import express from 'express'
import { useContainer, createConnection, Connection } from 'typeorm'
import Container from 'typedi'

import { ServerConfiguration } from '../types'

import logger from './logger'

useContainer(Container)

export class Server {

    private static expressApp = express()
    private connection?: Connection
    private config: ServerConfiguration

    constructor(config: ServerConfiguration) {
        this.config = config
    }

    async init() {
        this.connection = await createConnection(this.config.database)
    }

    listen() {
        if (this.connection) {
            logger.info(`Listenning at port ${this.config.port}`)
            Server.expressApp.listen(this.config.port)
        } else {
            logger.error('No database connection')
            throw new Error('DB_CONNECTION')
        }
    }

}
