import { generateBaseProject } from '../handlers/project'

export const command = 'new <name>'
export const desc = 'Create application'
export const builder = (args: any) => {
    args.option('yes', {
        alias: 'y',
        type: 'boolean',
        description: 'Create project with default values'
    })
}
export const handler = generateBaseProject
