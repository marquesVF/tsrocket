import { capitalCase } from 'change-case'
import { plural } from 'pluralize'

import { InjectableGeneratorArguments, ControllerData } from '../types'
import { importServices } from '../utils/injectable'
import { generateFile } from '../utils/files'

export function generateController(args: InjectableGeneratorArguments) {
    const { name, services } = args

    const templateData: ControllerData = {
        name: capitalCase(name),
        path: plural(name),
        services: services ? importServices(services) : undefined
    }

    generateFile(name, 'controller', templateData)
}
