import { GeneratorArguments } from '../types'

import { generateModel } from './generators/model'
import { generateInjectable } from './generators/injectable'

export function generateEntity(args: GeneratorArguments) {
    const { name, entity, options } = args
    switch (entity) {
        case 'controller':
            generateInjectable(name, entity)
            break
        case 'service':
            generateInjectable(name, entity)
            break
        case 'model':
            generateModel(name, options)
            break
        default:
            throw new Error(`Invalid option '${entity}'`)
    }
}
