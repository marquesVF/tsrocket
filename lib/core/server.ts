import * as glob from 'glob'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { Connection } from 'typeorm'

import { ServerConfiguration, ResponseInterceptor } from '../types'
import { Logger } from '../logger'

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

    private async loadControllers() {
        for (const controller of this.config.controllers) {
            const filePath = glob.sync(controller)
            for (const path of filePath) {
                const relPath = `${process.cwd()}/${path.replace('.ts', '')}`
                const module = await import(relPath)
                const klass = module.default

                Logger.debug(`loading ${klass.name}`)

                new klass()
            }
        }
    }

    async init(connection: Connection) {
        Container.set('connection', connection)
        Server.httpServer.use(express.json())
        Server.httpServer.use(express.urlencoded({ extended: true }))
        Server.httpServer.use(helmet())

        await this.loadControllers()
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

    disableCors() {
        Server.httpServer.use(cors())
    }

}
