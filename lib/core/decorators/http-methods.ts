import { getMetadataStorage } from '../metadata/metadata-storage'
import { RouteArguments } from '../metadata/types'
import { DtoClass } from '../types'

function registerRoute(args: RouteArguments) {
    const { target, propertyKey, method, path, dto: mapper } = args

    const key = propertyKey as string
    const controller = target.constructor.name
    getMetadataStorage()
        // eslint-disable-next-line max-len
        .storeRouteMetadata({ path, method, propertyKey: key, controller, dto: mapper })
}

export function Get(path: string, dto?: DtoClass): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'get', path, dto })
    }
}

export function Post(path: string, dto?: DtoClass): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'post', path, dto })
    }
}

export function Put(path: string, dto?: DtoClass): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'put', path, dto })
    }
}

export function Delete(path: string, dto?: DtoClass): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'delete', path, dto })
    }
}
