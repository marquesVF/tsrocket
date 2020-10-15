import { pascalCase } from 'change-case'
import { plural } from 'pluralize'

import { generateFile } from '../utils/generateFile'
import {
    Column,
    ModelGeneratorArguments,
    RepositoryData,
    ServiceData,
    ControllerData,
    ModelRelation,
    ModelProperty,
    ModelData,
    RelatedModelUpdate,
    DtoData
} from '../types'
import { isRelation } from '../utils/type-checker'
import { handleRelation } from '../utils/handle-relations'
import { updateModel } from '../utils/update-model'
import {
    DtoValidator,
    processType,
    processFieldOptions
} from '../utils/model-type-validator'
import { generateMigration } from '../../integration/typeorm'

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
            // TODO handle an invalid type
            columns.push({
                name: propName,
                validator: DtoValidator[type],
                nullable,
                fieldOptions: processFieldOptions(type, nullable),
                type: processType(type)
            })
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

/**
 * Handle repository, service and controller generation
 */
function generateRelatedFiles(
    name: string,
    shouldGenerateController: boolean,
    shouldGenerateService: boolean,
    fields?: Column[],
    properties?: string[]
) {
    generateReposiory(name)

    if ((shouldGenerateService || shouldGenerateController) && properties) {
        const validatorImports = fields
            ? [...new Set(fields.map(field => field.validator))].join(', ')
            : undefined
        const dtoData: DtoData = {
            name: pascalCase(name),
            validatorImports,
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

    generateRelatedFiles(name, c, s, modelData.columns, properties)
    generateMigration(name)
}
