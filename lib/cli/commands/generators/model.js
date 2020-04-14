const templates = require('../../templates')
const logger = require('../../logger')('debug')
const fs = require('fs')
const { capitalCase } = require('change-case')
const child = require('child_process')

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

function generateReposiory(modelName) {
    const rootPath = `${process.cwd()}/src/repositories`
    const filePath = `${rootPath}/${modelName}.ts`

    const modelData = { modelClass: capitalCase(modelName), modelName }

    const model = templates.parse('repository.ts.hbs', modelData)

    fs.writeFileSync(filePath, model)
    logger.info(`new repository at ${filePath}`)
}

function generateModel(argv) {
    const { name } = argv
    const rootPath = `${process.cwd()}/src/models`
    const filePath = `${rootPath}/${name}.ts`

    if (fs.existsSync(filePath)) {
        logger.warn(`model ${name} already exists at ${filePath}`)

        return
    }

    const model = templates.parse(
        'model.ts.hbs',
        { ...generateColumns(argv), model: capitalCase(name) }
    )

    fs.writeFileSync(filePath, model)
    logger.info(`new model at ${filePath}`)

    generateReposiory(name)

    child.execSync(
        `yarn dev:orm migration:generate -n ${name}-migration`,
        { stdio: 'inherit' }
    )
}

module.exports = generateModel
