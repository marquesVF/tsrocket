import fs from 'fs'

import { capitalCase } from 'change-case'

import logger from '../../logger'
import { parse } from '../templates'

import { generateModel } from './generators/model'

type Domain = 'service' | 'controller' | 'model'

type GeneratorArguments = {
    name: string
    generator: Domain
    options?: string[]
}

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

function generate(name: string, domain: Domain, options?: string[]) {
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

export function generator(args: GeneratorArguments) {
    const { name, generator, options } = args
    switch (generator) {
        case 'controller':
            generate(name, generator)
            break
        case 'service':
            generate(name, generator)
            break
        case 'model':
            generateModel(name, options)
            break
        default:
            throw new Error(`Invalid option '${generator}'`)
    }
}
