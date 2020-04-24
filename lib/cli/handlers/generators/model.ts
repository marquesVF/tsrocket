import child from 'child_process'

import { capitalCase } from 'change-case'

import { generateFile } from '../utils/files'
import {
    Column,
    ModelGeneratorArguments,
    RepositoryData,
    ServiceData
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
        modelClass: capitalCase(name),
        modelName: name
    }

    generateFile(name, 'repository', repositoryData)
}

function generateService(name: string) {
    const model = capitalCase(name)
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
    const { name, properties, s: shouldGenerateService } = args

    const columns = properties ? generateColumns(properties) : undefined
    const modelData = {
        columns,
        name: capitalCase(name)
    }

    generateFile(name, 'model', modelData)
    generateReposiory(name)

    if (shouldGenerateService) {
        generateService(name)
    }

    child.execSync(
        `yarn dev:orm migration:generate -n ${name}-migration`,
        { stdio: 'inherit' }
    )
}
