const fs = require('fs')
const logger = require('../logger')('debug')
const templates = require('../templates')
const { capitalCase } = require('change-case')

function generateFile(name, domain) {
    const rootPath = `${process.cwd()}/src/${domain}s`
    const context = {
        name: capitalCase(name),
        path: name
    }
    const controller = templates.parse(`${domain}.ts.hbs`, context)

    const filePath = `${rootPath}/${name}.ts`
    fs.writeFileSync(filePath, controller)
    logger.info(`New ${domain} at ${filePath}`)
}

function generateArtifact(argv) {
    const artifact = argv.artifact
    switch (artifact) {
        case 'controller':
            generateFile(argv.name, 'controller')
            break
        case 'service':
            generateFile(argv.name, 'service')
            break
        default:
            throw new Error(`Invalid option '${artifact}'`)
    }
}

module.exports = generateArtifact
