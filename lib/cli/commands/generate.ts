import { Argv } from 'yargs'

export const command = 'generate <entity>'
export const aliases = ['g']
export const desc = 'Generate a controller, service or model'
export const builder = (yargs: Argv<{}>) => yargs.commandDir('generate')
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const handler = () => {}
