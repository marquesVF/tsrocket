const yargs = require('yargs')
const newApp = require('./cli/commands/app')
const newController = require('./cli/commands/controller')

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
        'Generate project artifact',
        {},
        newController
    )
    .help('h')
    .alias('h', 'help')
    .argv
