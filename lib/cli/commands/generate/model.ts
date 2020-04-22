import { Argv } from 'yargs'

import { ModelGeneratorArguments } from '../../types'
import { generateModel } from '../../handlers/generators/model'

export const command = 'model <name> [properties...]'
export const aliases = ['mo']
export const desc = 'Generate a new model with its properties'
export const builder = (yargs: Argv<{}>) => yargs
    .positional('name', {
        describe: 'model name',
        type: 'string'
    })
    .positional('properties', {
        describe: 'model properties (format: <name>:<type> or <name>?:<type>)'
    })
export const handler = (args: ModelGeneratorArguments) => {
    const { name, properties } = args

    generateModel(name, properties)
}
