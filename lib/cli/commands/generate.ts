import { generateEntity } from '../handlers/generator'

export const command = [
    'generate <entity> <name> [options..]',
    'g <entity> <name> [options..]'
]
export const desc = 'Generate a controller, service or model'
export const builder = (args: any) => {
    args.positional('entity', {
        describe: 'scaffold project entities',
        choices: ['controller', 'service', 'model'],
        type: 'string'
    }).positional('name', {
        describe: 'entity name'
    })
}
export const handler = generateEntity
