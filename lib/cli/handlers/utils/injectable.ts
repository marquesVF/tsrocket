import fs from 'fs'

import { capitalCase } from 'change-case'

import { ImportableServiceData } from '../types'

export function importServices(services: string[]): ImportableServiceData[] {
    return services
        .filter(name => {
            const path = `${process.cwd()}/src/services/${name}.ts`

            return fs.existsSync(path)
        })
        .map(service => ({
            name: capitalCase(service),
            variable: service
        }))
}
