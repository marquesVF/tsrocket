import { Argv } from 'yargs'

import { InjectableGeneratorArguments } from '../../types'
import { generateInjectable } from '../../handlers/generators/injectable'

export const command = 'controller <name> [services...]'
export const aliases = ['co']
export const desc = 'Generate a new controller with service dependencies'
export const builder = (yargs: Argv<{}>) => yargs
    .positional('name', {
        describe: 'controller name',
        type: 'string'
    })
    .positional('services', {
        describe: 'services to be injected into the controller class'
    })
export const handler = (args: InjectableGeneratorArguments) => {
    const { name, services } = args

    generateInjectable(name, 'controller', services)
}
