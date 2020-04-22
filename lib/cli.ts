import yargs from 'yargs'

import { generateBaseProject } from './cli/handlers/project'
import { generateEntity } from './cli/handlers/generator'

export default yargs
    .command(
        'new <name>',
        'Create application',
        args => {
            args.option('yes', {
                alias: 'y',
                type: 'boolean',
                description: 'Create project with default values'
            })
        },
        generateBaseProject
    )
    .command(
        [
            'generate <entity> <name> [options..]',
            'g <entity> <name> [options..]'
        ],
        'Generate a controller, service or model',
        args => {
            args.positional('entity', {
                describe: 'scaffold project entities',
                choices: ['controller', 'service', 'model'],
                type: 'string'
            }).positional('name', {
                describe: 'entity name'
            })
        },
        generateEntity
    )
    .help('h')
    .alias('h', 'help')
    .argv
