import express from 'express'

import { ServerConfiguration } from '../types'

import { loadControllers } from './utils/loaders'
import logger from './logger'
import { getMetadataStorage } from './metadata/metadata-storage'

export class Server {

    private static expressApp = express()
    private config: ServerConfiguration

    constructor(config: ServerConfiguration) {
        this.config = config
    }

    async init() {
        await loadControllers(this.config.constrollers)
        getMetadataStorage().buildRoutes(Server.expressApp)
    }

    listen() {
        logger.info(`listenning at port ${this.config.port}`)
        Server.expressApp.listen(this.config.port)
    }

}
