import yargs from 'yargs'

import { newServer } from './cli/commands/server'
import { generator } from './cli/commands/generator'

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
        newServer
    )
    .command(
        [
            'generate <generator> <name> [options..]',
            'g <generator> <name> [options..]'
        ],
        'Generate a controller, service or model',
        yargs => {
            yargs.positional('generator', {
                describe: 'scaffold project entities',
                choices: ['controller', 'service', 'model'],
                type: 'string'
            }).positional('name', {
                describe: 'entity name'
            })
        },
        generator
    )
    .help('h')
    .alias('h', 'help')
    .argv
