import fs from 'fs'

import { pascalCase } from 'change-case'

import { ImportableServiceData } from '../types'

export function importServices(services: string[]): ImportableServiceData[] {
    return services
        .filter(name => {
            const path = `${process.cwd()}/src/services/${name}.ts`

            return fs.existsSync(path)
        })
        .map(service => ({
            name: pascalCase(service),
            variable: service
        }))
}
