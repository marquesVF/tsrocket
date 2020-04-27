import child from 'child_process'

import { pascalCase } from 'change-case'
import { plural } from 'pluralize'

import { generateFile } from '../utils/files'
import {
    Column,
    ModelGeneratorArguments,
    RepositoryData,
    ServiceData,
    ControllerData
} from '../types'

function generateColumns(properties: string[]): Column[] {
    return properties.map(columnOption => {
        const nullable = columnOption.includes('?')
        const [name, type] = nullable
            ? columnOption.split('?:')
            : columnOption.split(':')

        return { name, type, nullable }
    })
}

function generateReposiory(name: string) {
    const repositoryData: RepositoryData = {
        modelClass: pascalCase(name),
        modelName: name
    }

    generateFile(name, 'repository', repositoryData)
}

function generateService(name: string) {
    const model = pascalCase(name)
    const serviceData: ServiceData = {
        name: model,
        repository: {
            model,
            variable: name
        }
    }

    generateFile(name, 'service', serviceData)
}

export function generateModel(args: ModelGeneratorArguments) {
    const {
        name,
        properties,
        s: shouldGenerateService,
        c: shouldGenerateController
    } = args

    const columns = properties ? generateColumns(properties) : undefined
    const modelData = {
        columns,
        name: pascalCase(name)
    }

    generateFile(name, 'model', modelData)
    generateReposiory(name)

    if ((shouldGenerateService || shouldGenerateController) && properties) {
        const dtoData = {
            name: pascalCase(name),
            fields: generateColumns(properties)
        }
        generateFile(name, 'dto', dtoData)

        generateService(name)
    }

    // Should only generate CRUD controller if there're properties
    if (shouldGenerateController && properties) {
        const controllerData: ControllerData = {
            name: pascalCase(name),
            path: plural(name),
            crud: {
                name: pascalCase(name),
                variable: name
            }
        }

        generateFile(name, 'controller', controllerData)
    }

    // TODO does not generate duplicated migrations
    { child.execSync(
        `yarn dev:orm migration:generate -n ${name}-migration`,
        { stdio: 'inherit' }
    ) }
}
