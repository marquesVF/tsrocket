import { getMetadataStorage } from '../metadata/metadata-storage'
import { RouteArguments } from '../metadata/types'

function registerRoute(args: RouteArguments) {
    const { target, propertyKey, method, path } = args

    const key = propertyKey as string
    const controller = target.constructor.name
    getMetadataStorage()
        .storeRouteMetadata({ path, method, propertyKey: key, controller })
}

export function GET(path: string): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'get', path })
    }
}

export function POST(path: string): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'post', path })
    }
}

// TODO add support to it
export function DELETE(path: string): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        registerRoute({ target, propertyKey, method: 'delete', path })
    }
}
