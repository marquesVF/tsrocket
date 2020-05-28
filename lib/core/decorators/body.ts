import { getMetadataStorage } from '../metadata/metadata-storage'
import {ClassType} from '../metadata/types'

export function Body(argType: ClassType) {
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
