const yargs = require('yargs')
const newApp = require('./cli/commands/app')
const generateArtifact = require('./cli/commands/generate')

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
        'gen <artifact> <name>',
        'Generate controller or service',
        (yargs) => {
            yargs.positional('artifact', {
                describe: 'can be either `controller` or `service`',
                type: 'string'
            })
        },
        generateArtifact
    )
    .help('h')
    .alias('h', 'help')
    .argv
