import { Argv } from 'yargs'

import { generateService } from '../../handlers/generators/service'

export const command = 'service <name> [services...]'
export const aliases = ['se']
export const desc = 'Generate a new service with optional service dependencies'
export const builder = (yargs: Argv<{}>) => yargs
    .positional('name', {
        describe: 'services name',
        type: 'string'
    })
    .positional('services', {
        describe: 'services to be injected into the controller class'
    })
export const handler = generateService
