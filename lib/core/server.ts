import express from 'express'
import { Connection } from 'typeorm'

import { ServerConfiguration } from '../types'
import logger from '../logger'

import { loadControllers } from './utils/loaders'
import { getMetadataStorage } from './metadata/metadata-storage'
import { Container } from './container'

export class Server {

    static app = express()
    private config: ServerConfiguration

    constructor(config: ServerConfiguration) {
        this.config = config
    }

    async init(connection: Connection) {
        Container.set('connection', connection)
        Server.app.use(express.json())
        Server.app.use(express.urlencoded({ extended: true }))

        await loadControllers(this.config.constrollers)
        getMetadataStorage().buildRoutes(Server.app)
    }

    listen() {
        logger.info(`listening at port ${this.config.port}`)
        Server.app.listen(this.config.port)
    }

}
