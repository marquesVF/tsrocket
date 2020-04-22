import { GeneratorArguments } from '../types'

import { generateModel } from './generators/model'
import { generateInjectable } from './generators/injectable'

export function generateEntity(args: GeneratorArguments) {
    const { name, generator, options } = args
    switch (generator) {
        case 'controller':
            generateInjectable(name, generator)
            break
        case 'service':
            generateInjectable(name, generator)
            break
        case 'model':
            generateModel(name, options)
            break
        default:
            throw new Error(`Invalid option '${generator}'`)
    }
}
