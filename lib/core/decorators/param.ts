import { getMetadataStorage } from '../metadata/metadata-storage'

export function Params(argType: any) {
    return function (target: Object, propertyKey: string, index: number) {
        const controller = target.constructor.name
        getMetadataStorage().storeArgMetadata({
            type: 'params',
            target: argType,
            controller,
            propertyKey,
            index
        })
    }
}
