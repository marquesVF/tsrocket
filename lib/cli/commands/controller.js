const fs = require('fs')
const logger = require('../logger')('debug')
const templates = require('../templates')
const { capitalCase } = require('change-case')

function newController(argv) {
    const rootPath = `${process.cwd()}/src/controllers`
    const { name } = argv
    const context = {
        name: capitalCase(name),
        path: name
    }
    const controllerJson = templates.parse('controller.ts.hbs', context)

    const filePath = `${rootPath}/${name}.ts`
    fs.writeFileSync(filePath, controllerJson)
    logger.info(`New controller at ${filePath}`)
}

module.exports = newController
