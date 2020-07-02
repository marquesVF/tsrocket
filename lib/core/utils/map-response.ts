import { ResponseMapper, FieldMetadata } from '../metadata/types'
import { Logger } from '../../logger'

import { fieldFilter } from './field-filter'

type MappedResponse = { [key: string]: any }

export function mapResponse(
    mapper: ResponseMapper,
    fields: FieldMetadata[],
    result: any
): MappedResponse {
    if (Array.isArray(result)) {
        return result.map(res => mapResponse(mapper, fields, res))
    } else {
        const targetFields = fields.filter(field => fieldFilter(field, mapper))

        const mappedObject: { [key: string]: any } = {}

        targetFields.forEach(field => {
            const { propertyKey, options } = field

            const value = result[propertyKey]
            if (value !== undefined) {
                if (options?.type) {
                    const nestedMapper = options.type
                    mappedObject[propertyKey]
                        = mapResponse(nestedMapper, fields, value)
                } else {
                    mappedObject[propertyKey] = value
                }
            } else if (!options?.nullable) {
                Logger.error(
                    `Field '${propertyKey}' from '${mapper.name}' was not `
                        + 'found in the controller response'
                )

                throw new Error('Internal Server Error')
            }
        })

        return mappedObject
    }
}
