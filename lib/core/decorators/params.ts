import { getMetadataStorage } from '../metadata/metadata-storage'
import { ClassType } from '../metadata/types'

export function Params(argType?: ClassType) {
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
