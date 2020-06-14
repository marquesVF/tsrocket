import { getMetadataStorage } from '../metadata/metadata-storage'
import { RouteArguments, ResponseMapper } from '../metadata/types'

function registerRoute(args: RouteArguments) {
    const { target, propertyKey, method, path, mapper } = args

    const key = propertyKey as string
    const controller = target.constructor.name
    getMetadataStorage()
        // eslint-disable-next-line max-len
        .storeRouteMetadata({ path, method, propertyKey: key, controller, mapper })
}

export function Get(path: string, mapper?: ResponseMapper): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'get', path, mapper })
    }
}

export function Post(path: string, mapper?: ResponseMapper): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'post', path, mapper })
    }
}

export function Put(path: string, mapper?: ResponseMapper): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'put', path, mapper })
    }
}

export function Delete(path: string, mapper?: ResponseMapper): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'delete', path, mapper })
    }
}
