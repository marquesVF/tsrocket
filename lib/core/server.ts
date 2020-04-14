import express from 'express'
import { Connection } from 'typeorm'

import { ServerConfiguration } from '../types'

import { loadControllers } from './utils/loaders'
import logger from './logger'
import { getMetadataStorage } from './metadata/metadata-storage'
import { Container } from './container'

export class Server {

    private static expressApp = express()
    private config: ServerConfiguration

    constructor(config: ServerConfiguration) {
        this.config = config
    }

    async init(connection: Connection) {
        Container.set('connection', connection)

        await loadControllers(this.config.constrollers)
        getMetadataStorage().buildRoutes(Server.expressApp)
    }

    listen() {
        logger.info(`listenning at port ${this.config.port}`)
        Server.expressApp.listen(this.config.port)
    }

}
