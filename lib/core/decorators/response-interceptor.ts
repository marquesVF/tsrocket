import { ResponseInterceptor } from '../../types'
import { getMetadataStorage } from '../metadata/metadata-storage'
import { Container } from '../container'

export function UseResponseInterceptor(
    interceptor: new (...args: any[]) => ResponseInterceptor
): ClassDecorator {
    const interceptorInstance: ResponseInterceptor = Container.get(interceptor)

    return target => {
        const controller = target.name
        getMetadataStorage().storeResponseInterceptor({
            interceptor: interceptorInstance,
            controller
        })
    }
}
