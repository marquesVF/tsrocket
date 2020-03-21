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
        App.expressApp.get(path, async (req, res) => {
            let response
            try {
                const context: Context = {
                    req,
                    args: {}
                }
                response = await callback(context)
            } catch (err) {
                // TODO handle error properly
                throw err
            }

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
        generateRoutes(this.options?.controllersPath)

        const serverPort = port ?? 3003

        logger.info(`Listenning at port ${serverPort}`)
        App.expressApp.listen(serverPort)
    }
}