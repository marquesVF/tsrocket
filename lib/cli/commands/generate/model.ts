import { Argv } from 'yargs'

import { generateModel } from '../../handlers/generators/model'

export const command = 'model <name> [properties...]'
export const aliases = ['mo']
export const desc = 'Generate a new model with its properties'
export const builder = (yargs: Argv<{}>) => yargs
    .option('service', {
        alias: 's',
        type: 'boolean',
        description: 'generate a basic CRUD model service'
    })
    .positional('name', {
        describe: 'model name',
        type: 'string'
    })
    .positional('properties', {
        // eslint-disable-next-line max-len
        describe: 'model properties (format: <name>:<type> or <name>?:<type> for nullable)'
    })
export const handler = generateModel
