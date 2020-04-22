import fs from 'fs'
import child from 'child_process'

import { capitalCase } from 'change-case'

import logger from '../../../logger'
import { parse } from '../../templates'

type Column = { [key: string]: any } & {
    name: string
    type: string
    nullable: boolean
}

function generateColumns(options: string[]): { columns: Column[] } {
    const columns: Column[] = options.map(columnOption => {
        const nullable = columnOption.includes('?')
        const [name, type] = nullable
            ? columnOption.split('?:')
            : columnOption.split(':')

        return { name, type, nullable }
    })

    return { columns }
}

function generateReposiory(modelName: string) {
    const rootPath = `${process.cwd()}/src/repositories`
    const filePath = `${rootPath}/${modelName}.ts`

    const modelData = { modelClass: capitalCase(modelName), modelName }

    const model = parse('repository.ts.hbs', modelData)

    fs.writeFileSync(filePath, model)
    logger.info(`new repository at ${filePath}`)
}

export function generateModel(name: string, options?: string[]) {
    const rootPath = `${process.cwd()}/src/models`
    const filePath = `${rootPath}/${name}.ts`

    if (fs.existsSync(filePath)) {
        logger.warn(`model ${name} already exists at ${filePath}`)

        return
    }

    const columns = options ? generateColumns(options) : {}
    const templateArguments = { ...columns, model: capitalCase(name) }
    const model = parse('model.ts.hbs', templateArguments)

    fs.writeFileSync(filePath, model)
    logger.info(`new model at ${filePath}`)

    generateReposiory(name)

    child.execSync(
        `yarn dev:orm migration:generate -n ${name}-migration`,
        { stdio: 'inherit' }
    )
}
