import yargs from 'yargs'

export default yargs
    .commandDir('cli/commands')
    .help('h')
    .alias('h', 'help')
    .argv
