const yargs = require('yargs')
const newServer = require('./cli/commands/server')
const generator = require('./cli/commands/generator')

const args = yargs
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

module.exports = args
