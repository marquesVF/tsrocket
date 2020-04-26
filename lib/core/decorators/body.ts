import { getMetadataStorage } from '../metadata/metadata-storage'

export function Body(argType: any) {
    return function (target: Object, propertyKey: string, index: number) {
        const controller = target.constructor.name
        getMetadataStorage().storeArgMetadata({
            type: 'body',
            target: argType,
            controller,
            propertyKey,
            index
        })
    }
}
