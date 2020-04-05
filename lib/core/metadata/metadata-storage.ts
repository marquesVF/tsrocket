import { Express, Router } from 'express'
import Container from 'typedi'

import { sanitizePath } from '../utils/sanitizers'
import { RestController } from '../rest-controller'

import { ControllerMetadata } from './definitions'
import { RouteMetadata } from './definitions/route-metadata'

export class MetadataStorage {

    private static _storage = new MetadataStorage()
    controllers: Record<string, ControllerMetadata> = {}
    getRoutes: RouteMetadata[] = []

    storeControllerMetadata(data: ControllerMetadata) {
        // TODO don't allow duplicated paths
        this.controllers[data.controller] = data
    }

    storeGetRouteMetadata(data: RouteMetadata) {
        this.getRoutes.push(data)
    }

    buildRoutes(app: Express) {
        this.getRoutes.forEach(route => {
            const { controller, method, path } = route
            const router = Router()
            const {
                path: controllerPath,
                target
            } = this.controllers[controller]

            const controllerObject: RestController = Container.get(target)
            router.get(path, async (req, res) => {
                const result = await controllerObject[method]({ req })
                const response = { data: result }

                res.send(response)
            })

            app.use(sanitizePath(controllerPath), router)
        })
    }

    static _getStorage() {
        return MetadataStorage._storage
    }

}

export function getMetadataStorage() {
    return MetadataStorage._getStorage()
}
