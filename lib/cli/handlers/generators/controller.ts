import { pascalCase } from 'change-case'
import { plural } from 'pluralize'

import {
    InjectableGeneratorArguments,
    ControllerData,
    CrudArgument
} from '../types'
import { importServices } from '../utils/injectable'
import { generateFile } from '../utils/files'

export function generateController(args: InjectableGeneratorArguments) {
    const { name, services, m: generateFromModel } = args

    const crud: CrudArgument | undefined = generateFromModel
        ? {
            name: pascalCase(name),
            variable: name
        }
        : undefined

    const templateData: ControllerData = {
        name: pascalCase(name),
        path: plural(name),
        services: services ? importServices(services) : undefined,
        crud
    }

    generateFile(name, 'controller', templateData)
}
