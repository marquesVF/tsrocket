import { FieldOptions } from '../types/decorator-types'
import { getMetadataStorage } from '../metadata/metadata-storage'

export function InputField(options?: FieldOptions) {
    return (target: any, propertyKey: string) => {
        const nullable = options?.nullable ?? false
        getMetadataStorage()
            .storeInputField({ nullable, target, propertyKey })
    }
}

