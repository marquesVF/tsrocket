import fs from 'fs'

import { capitalCase } from 'change-case'

import { InjectableDomain } from '../../types'
import logger from '../../../logger'
import { parse } from '../../templates'

type ImportableServices = {
    variable: string
    name: string
}

function importServices(imports: string[]): ImportableServices[] | undefined {
    return imports
        .filter(service => {
            const path = `${process.cwd()}/src/services/${service}.ts`

            return fs.existsSync(path)
        })
        .map(service => ({
            variable: service,
            name: capitalCase(service)
        }))
}

export function generateInjectable(
    name: string,
    domain: InjectableDomain,
    options?: string[]
) {
    const rootPath = `${process.cwd()}/src/${domain}s`
    const filePath = `${rootPath}/${name}.ts`

    if (fs.existsSync(filePath)) {
        logger.warn(`${domain} ${name} already exists at ${filePath}`)

        return
    }

    const context = {
        name: capitalCase(name),
        path: name,
        services: options ? importServices(options) : undefined
    }
    const controller = parse(`${domain}.ts.hbs`, context)

    fs.writeFileSync(filePath, controller)
    logger.info(`new ${domain} at ${filePath}`)
}
