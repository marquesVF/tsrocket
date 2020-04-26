import { getMetadataStorage } from '../metadata/metadata-storage'

export function Arg(argType: any) {
    return function (target: Object, propertyKey: string, index: number) {
        const controller = target.constructor.name
        getMetadataStorage().storeArgMetadata({
            target: argType,
            controller,
            propertyKey,
            index
        })
    }
}
