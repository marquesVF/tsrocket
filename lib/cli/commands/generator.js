const fs = require('fs')
const logger = require('../logger')('debug')
const templates = require('../templates')
const generateModel = require('./generators/model')
const { capitalCase } = require('change-case')

function importServices(imports) {
    const importedServices = imports.map(service => {
        const path = `${process.cwd()}/src/services/${service}.ts`
        const canImport = fs.existsSync(path)

        return canImport
            ? {
                variable: service,
                name: capitalCase(service)
            }
            : []
    }).flat()

    return importedServices.length > 0 ? importedServices : undefined
}

function generateFile(argv, domain) {
    const { name, options } = argv
    const rootPath = `${process.cwd()}/src/${domain}s`
    const filePath = `${rootPath}/${name}.ts`

    if (fs.existsSync(filePath)) {
        logger.warn(`${domain} ${name} already exists at ${filePath}`)

        return
    }

    const context = {
        name: capitalCase(name),
        path: name,
        services: importServices(options)
    }
    const controller = templates.parse(`${domain}.ts.hbs`, context)

    fs.writeFileSync(filePath, controller)
    logger.info(`new ${domain} at ${filePath}`)
}

function generator(argv) {
    const generator = argv.generator
    switch (generator) {
        case 'controller':
            generateFile(argv, 'controller')
            break
        case 'service':
            generateFile(argv, 'service')
            break
        case 'model':
            generateModel(argv)
            break
        default:
            throw new Error(`Invalid option '${generator}'`)
    }
}

module.exports = generator
