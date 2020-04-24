import { pascalCase } from 'change-case'

import { importServices } from '../utils/injectable'
import { generateFile } from '../utils/files'
import { InjectableGeneratorArguments, ServiceData } from '../types'

export function generateService(args: InjectableGeneratorArguments) {
    const { name, services } = args

    const templateData: ServiceData = {
        name: pascalCase(name),
        services: services ? importServices(services) : undefined
    }

    generateFile(name, 'service', templateData)
}
