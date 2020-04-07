const fs = require('fs')
const logger = require('../logger')('debug')
const templates = require('../templates')
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
    const { name, imports } = argv
    const rootPath = `${process.cwd()}/src/${domain}s`
    const filePath = `${rootPath}/${name}.ts`

    if (fs.existsSync(filePath)) {
        logger.warn(`${domain} ${name} already exists at ${filePath}`)

        return
    }

    const context = {
        name: capitalCase(name),
        path: name,
        services: importServices(imports)
    }
    const controller = templates.parse(`${domain}.ts.hbs`, context)

    fs.writeFileSync(filePath, controller)
    logger.info(`New ${domain} at ${filePath}`)
}

function generateArtifact(argv) {
    const artifact = argv.artifact
    switch (artifact) {
        case 'controller':
            generateFile(argv, 'controller')
            break
        case 'service':
            generateFile(argv, 'service')
            break
        default:
            throw new Error(`Invalid option '${artifact}'`)
    }
}

module.exports = generateArtifact
