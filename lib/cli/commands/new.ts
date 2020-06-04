import { Argv } from 'yargs'

import { generateBaseProject } from '../handlers/project'

export const command = [
    'new <name>',
    'n <name>'
]
export const desc = 'Create application'
export const builder = (yargs: Argv<{}>) => {
    yargs.option('yes', {
        alias: 'y',
        type: 'boolean',
        description: 'Create project with default values'
    })
    yargs.option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Print subcommand outputs'
    })
}
export const handler = generateBaseProject
