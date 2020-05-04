import child from 'child_process'

import { pascalCase } from 'change-case'
import { plural } from 'pluralize'

import { generateFile } from '../utils/files'
import {
    Column,
    ModelGeneratorArguments,
    RepositoryData,
    ServiceData,
    ControllerData,
    ModelRelation,
    ModelProperty,
    ModelData,
    RelatedModelUpdate
} from '../types'
import { isRelation } from '../utils/type-checker'
import { handleRelation } from '../utils/handle-relations'
import { updateModel } from '../utils/update-model'

type Properties = ModelProperty & {
    modelUpdates: RelatedModelUpdate[]
}

function processProperties(name: string, properties: string[]): Properties {
    const columns: Column[] = []
    const relations: ModelRelation[] = []
    const modelUpdates: RelatedModelUpdate[] = []

    properties.forEach(columnOption => {
        const nullable = columnOption.includes('?')
        const [propName, type] = nullable
            ? columnOption.split('?:')
            : columnOption.split(':')

        if (isRelation(type)) {
            const {
                modelRelations,
                relatedModelUpdate
            } = handleRelation(name, propName, type)

            relations.push(modelRelations)
            if (relatedModelUpdate) {
                modelUpdates.push(relatedModelUpdate)
            }
        } else {
            columns.push({ name: propName, type, nullable })
        }
    })

    return { columns, relations, modelUpdates }
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

function generateModelRelated(
    name: string,
    shouldGenerateController: boolean,
    shouldGenerateService: boolean,
    fields?: Column[],
    properties?: string[]
) {
    generateReposiory(name)

    if ((shouldGenerateService || shouldGenerateController) && properties) {
        const dtoData = {
            name: pascalCase(name),
            fields
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
}

export function generateModel(args: ModelGeneratorArguments) {
    const { name, properties, s, c } = args

    const props = properties ? processProperties(name, properties) : undefined
    const imports = props?.relations?.map(relation => relation.relation)
    const joinColumnImport = imports?.includes('OneToOne')
        || imports?.includes('ManyToMany')
        ? ['JoinColumn']
        : []
    const modelData: ModelData = {
        columns: props?.columns,
        relations: props?.relations,
        name: pascalCase(name),
        imports: [...new Set(imports), ...joinColumnImport]
    }

    generateFile(name, 'model', modelData)

    if (props?.modelUpdates) {
        for (const update of props.modelUpdates) {
            updateModel(update)
        }
    }

    generateModelRelated(name, s, c, modelData.columns, properties)

    // TODO does not generate duplicated migrations
    { child.execSync(
        // eslint-disable-next-line max-len
        `npx ts-node $(npm bin)/typeorm migration:generate --name ${name}-migration`,
        { stdio: 'inherit' }
    ) }
}
