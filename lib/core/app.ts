import express from 'express'
import { generateRoutes } from './controller'
import { Context } from './route'
import logger from './logger'

export type AppOptions = {
    controllersPath?: string
}

export class App {

    private static expressApp = express()

    private options?: AppOptions

    constructor(options?: AppOptions) {
        this.options = options
    }

    static registerGet(path: string, callback: Function) {
        logger.debug(`Registering ${path}`)
        App.expressApp.get(path, async (req, res) => {
            const context: Context = {
                req,
                args: {}
            }
            const response = await callback(context)

            if (response) {
                const jsonReponse = {
                    data: response
                }

                res.send(jsonReponse)
            } else {
                // Send internal server error
                res.status(500)
            }
        })
    }

    async listen(port?: number) {
        await generateRoutes(this.options?.controllersPath)

        const serverPort = port ?? 3000

        logger.info(`Listenning at port ${serverPort}`)
        App.expressApp.listen(serverPort)
    }
}