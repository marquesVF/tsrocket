import { readdirSync } from 'fs'

import { all } from 'bluebird'

import logger from './logger'

const DEFAULT_CONTROLLERS_PATH = `${process.cwd()}/src/controllers`

async function importController(path: string) {
    logger.debug(`Importing controller at ${path}`)
    const controllerModule = await import(`${DEFAULT_CONTROLLERS_PATH}/${path}`)
    const controllerClass = controllerModule.default

    return new controllerClass()
}

export async function generateRoutes(controllersPath?: string) {
    const path = controllersPath ?? DEFAULT_CONTROLLERS_PATH
    const filePaths = readdirSync(path).filter(path => path.endsWith('.ts'))

    await all(filePaths.map(importController))
}

export interface Controller { }
