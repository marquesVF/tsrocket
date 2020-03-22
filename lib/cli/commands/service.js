const fs = require('fs')
const logger = require('../logger')('debug')
const templates = require('../templates')
const { capitalCase } = require('change-case')

function newService(argv) {
    const rootPath = `${process.cwd()}/src/services`
    const { name } = argv
    const context = {
        name: capitalCase(name),
        path: name
    }
    const serviceJson = templates.parse('service.ts.hbs', context)

    const filePath = `${rootPath}/${name}.ts`
    fs.writeFileSync(filePath, serviceJson)
    logger.info(`New service at ${filePath}`)
}

module.exports = newService
