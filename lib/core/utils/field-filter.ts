import { FieldMetadata } from '../metadata/types'

export function fieldFilter(metadata: FieldMetadata, mapper: any) {
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
