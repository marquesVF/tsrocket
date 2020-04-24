import { Express, Router, Request, Response } from 'express'

import { sanitizePath } from '../utils/sanitizers'
import { RestController } from '../rest-controller'
import { Container } from '../container'

import { ControllerMetadata, RouteMetadata } from './types'

export class MetadataStorage {

    private static _storage = new MetadataStorage()
    controllers: Record<string, ControllerMetadata> = {}
    routes: RouteMetadata[] = []

    private buildRoute(route: RouteMetadata) {
        const { controller, propertyKey, path, method } = route
        const router = Router()
        const {
            path: controllerPath,
            target
        } = this.controllers[controller]

        const controllerObject: RestController = Container.get(target)
        // TODO improve error handling
        const handler = async (req: Request, res: Response) => {
            const args = { params: req.body }
            const result = await controllerObject[propertyKey](args)
            const response = { data: result }

            res.send(response)
        }

        router[method](path, handler)

        return { router, path: controllerPath }
    }

    storeControllerMetadata(data: ControllerMetadata) {
        // TODO don't allow duplicated paths
        this.controllers[data.controller] = data
    }

    storeRouteMetadata(data: RouteMetadata) {
        this.routes.push(data)
    }

    buildRoutes(app: Express) {
        this.routes.forEach(route => {
            const { router, path } = this.buildRoute(route)

            app.use(sanitizePath(path), router)
        })
    }

    static _getStorage() {
        return MetadataStorage._storage
    }

}

export function getMetadataStorage() {
    return MetadataStorage._getStorage()
}
