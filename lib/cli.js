const yargs = require('yargs')
const { newApp } = require('./cli/commands')

yargs
    .command('new [app]', 'Create a new application', {}, newApp)
    .help('h')
    .alias('h', 'help')
    .argv
