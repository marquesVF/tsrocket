const yargs = require('yargs')
const newServer = require('./cli/commands/server')
const generateArtifact = require('./cli/commands/generate')

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
        'gen <artifact> <name> [imports..]',
        'Generate controller or service',
        yargs => {
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

module.exports = args
