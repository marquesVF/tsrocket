import { ResponseInterceptor } from '../../types'
import { getMetadataStorage } from '../metadata/metadata-storage'

export function UseResponseInterceptor(
    interceptor: ResponseInterceptor
): ClassDecorator {
    return target => {
        const controller = target.name
        getMetadataStorage().storeResponseInterceptor({
            interceptor,
            controller
        })
    }
}
