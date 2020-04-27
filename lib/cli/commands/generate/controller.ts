import { Argv } from 'yargs'

import { generateController } from '../../handlers/generators/controller'

export const command = 'controller <name> [services...]'
export const aliases = ['co']
export const desc = 'Generate a new controller with service dependencies'
export const builder = (yargs: Argv<{}>) => yargs
    .option('model', {
        alias: 'm',
        type: 'boolean',
        description: 'generate CRUD controller from model'
    })
    .positional('name', {
        describe: 'controller name',
        type: 'string'
    })
    .positional('services', {
        describe: 'services to be injected into the controller class'
    })
export const handler = generateController
