import express from 'express'
import { Connection } from 'typeorm'

import { ServerConfiguration, ResponseInterceptor } from '../types'
import { Logger } from '../logger'

import { loadControllers } from './utils/loaders'
import { getMetadataStorage } from './metadata/metadata-storage'
import { Container } from './container'
import {
    DefaultResponseInterceptor
} from './defaults/default-response-interceptor'

export class Server {

    static globalResponseInterceptor = new DefaultResponseInterceptor()
    static httpServer = express()
    private config: ServerConfiguration

    constructor(config: ServerConfiguration) {
        this.config = config
    }

    async init(connection: Connection) {
        Container.set('connection', connection)
        Server.httpServer.use(express.json())
        Server.httpServer.use(express.urlencoded({ extended: true }))

        await loadControllers(this.config.constrollers)
        getMetadataStorage().buildRoutes(Server.httpServer)
    }

    listen() {
        Logger.info(`listening at port ${this.config.port}`)
        Server.httpServer.listen(this.config.port)
    }

    useResponseInterceptor(
        interceptor: new (...args: any[]) => ResponseInterceptor
    ) {
        Server.globalResponseInterceptor = Container.get(interceptor)
    }

}
