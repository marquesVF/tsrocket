const yargs = require('yargs')
const newApp = require('./cli/commands/app')
const newController = require('./cli/commands/controller')
const newService = require('./cli/commands/service')

yargs
    .command('new <app>', 'Create application', (args) => {
            args.option('yes', {
                alias: 'y',
                type: 'boolean',
                description: 'Run commands with default values'
            })
        },
        newApp
    )
    .command(
        'gen controler <name>',
        'Generate controller',
        {},
        newController
    )
    .command(
        'gen service <name>',
        'Generate service',
        {},
        newService
    )
    .help('h')
    .alias('h', 'help')
    .argv
