#!/usr/bin/env node

const yargs = require('yargs')
const { newApp } = require('../lib/cli/handlers')

const argv = yargs
    .command('new [app]', 'Create a new application', {}, newApp)
    .help('h')
    .alias('h', 'help')
    .argv

// TODO handle arguments
