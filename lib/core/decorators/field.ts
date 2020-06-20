import { FieldOptions } from '../types/decorator-types'
import { getMetadataStorage } from '../metadata/metadata-storage'

export function Field(options?: FieldOptions) {
    return (target: any, propertyKey: string) => {
        getMetadataStorage()
            .storeField({ options, target, propertyKey })
    }
}

