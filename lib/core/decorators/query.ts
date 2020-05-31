import { getMetadataStorage } from '../metadata/metadata-storage'
import { ClassType } from '../metadata/types'

export function Query(argType: ClassType) {
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
