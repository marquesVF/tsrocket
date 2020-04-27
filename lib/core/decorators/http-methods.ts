import { getMetadataStorage } from '../metadata/metadata-storage'
import { RouteArguments } from '../metadata/types'

function registerRoute(args: RouteArguments) {
    const { target, propertyKey, method, path } = args

    const key = propertyKey as string
    const controller = target.constructor.name
    getMetadataStorage()
        .storeRouteMetadata({ path, method, propertyKey: key, controller })
}

export function Get(path: string): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'get', path })
    }
}

export function Post(path: string): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'post', path })
    }
}

export function Put(path: string): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'put', path })
    }
}

export function Delete(path: string): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'delete', path })
    }
}
