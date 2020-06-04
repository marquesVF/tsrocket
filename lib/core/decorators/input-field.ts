import { FieldOptions } from '../types/decorator-types'
import { getMetadataStorage } from '../metadata/metadata-storage'

export function InputField(options?: FieldOptions) {
    return (target: any, propertyKey: string) => {
        getMetadataStorage()
            .storeInputField({ options, target, propertyKey })
    }
}

