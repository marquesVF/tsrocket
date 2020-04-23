import { Argv } from 'yargs'

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
export const handler = generateModel
