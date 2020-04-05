import { getMetadataStorage } from '../metadata/metadata-storage'

export function Controller(optionalPath?: string): ClassDecorator {
    return target => {
        const path = optionalPath ?? '/'
        const controller = target.name
        getMetadataStorage()
            .storeControllerMetadata({ path, controller, target })
    }
}

export function GET(path: string): MethodDecorator {
    return (prototype, rawMethod) => {
        const method = rawMethod as string
        const controller = prototype.constructor.name
        getMetadataStorage()
            .storeGetRouteMetadata({ path, method, controller })
    }
}
