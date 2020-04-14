import { getMetadataStorage } from '../metadata/metadata-storage'

export function Controller(optionalPath?: string): ClassDecorator {
    return target => {
        const path = optionalPath ?? '/'
        const controller = target.name
        getMetadataStorage()
            .storeControllerMetadata({ path, controller, target })
    }
}
