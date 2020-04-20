import * as glob from 'glob'

import logger from '../../logger'

export async function loadControllers(controllers: string[]) {
    for (const controller of controllers) {
        const filePath = glob.sync(controller)
        for (const path of filePath) {
            const relPath = `${process.cwd()}/${path.replace('.ts', '')}`
            const module = await import(relPath)
            const klass = module.default

            logger.debug(`${klass.name} loaded`)

            new klass()
        }
    }
}
