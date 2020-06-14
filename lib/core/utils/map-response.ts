import { ResponseMapper, FieldMetadata } from '../metadata/types'
import { Logger } from '../../logger'

type MappedResponse = { [key: string]: any }

export function mapResponse(
    mapper: ResponseMapper,
    fields: FieldMetadata[],
    result: any
): MappedResponse {
    if (Array.isArray(result)) {
        return result.map(res => mapResponse(mapper, fields, res))
    } else {
        // eslint-disable-next-line max-len
        const fieldFilter = (metadata: FieldMetadata, mapper: ResponseMapper) => {
            const mapperNames: string[] = [mapper.name]

            // It should get inherited fields as well
            let parent = Object.getPrototypeOf(mapper.prototype)
            while (parent !== undefined) {
                mapperNames.push(parent.constructor.name)

                parent = parent.prototype
                    ? Object.getPrototypeOf(parent.prototype)
                    : undefined
            }

            return mapperNames.includes(metadata.target.constructor.name)
        }

        const targetFields = fields.filter(meta => fieldFilter(meta, mapper))

        const mappedObject: { [key: string]: any } = {}

        targetFields.forEach(field => {
            const { propertyKey, options } = field

            const value = result[propertyKey]
            if (value) {
                if (options?.transform) {
                    const nestedMapper = options.transform()
                    const nestedFields = fields.filter(meta =>
                        fieldFilter(meta, nestedMapper))

                    mappedObject[propertyKey]
                        = mapResponse(nestedMapper, nestedFields, value)
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
