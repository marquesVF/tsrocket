const templates = require('../../templates')
const logger = require('../../logger')('debug')
const fs = require('fs')

function generateColumns(argv) {
    const columns = argv.options.map(columnOption => {
        const nullable = columnOption.includes('?')
        const [name, type] = nullable
            ? columnOption.split('?:')
            : columnOption.split(':')

        return { name, type, nullable }
    })

    return { columns }
}

function generateModel(argv) {
    const { name } = argv
    const rootPath = `${process.cwd()}/src/models`
    const filePath = `${rootPath}/${name}.ts`

    if (fs.existsSync(filePath)) {
        logger.warn(`model ${name} already exists at ${filePath}`)

        return
    }

    const model = templates.parse('model.ts.hbs', generateColumns(argv))

    fs.writeFileSync(filePath, model)
    logger.info(`new model at ${filePath}`)
}

module.exports = generateModel
