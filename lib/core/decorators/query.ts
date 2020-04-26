import { getMetadataStorage } from '../metadata/metadata-storage'

export function Query(argType: any) {
    return function (target: Object, propertyKey: string, index: number) {
        const controller = target.constructor.name
        getMetadataStorage().storeArgMetadata({
            type: 'query',
            target: argType,
            controller,
            propertyKey,
            index
        })
    }
}
