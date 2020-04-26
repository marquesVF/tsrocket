import { Express, Router, Request, Response } from 'express'

import { sanitizePath } from '../utils/sanitizers'
import { RestController } from '../rest-controller'
import { Container } from '../container'
import { validate } from '../utils/validate'

import {
    ControllerMetadata,
    RouteMetadata,
    ArgMetadata,
    InputFieldMetadata
} from './types'

export class MetadataStorage {

    private static _storage = new MetadataStorage()
    private controllers: Record<string, ControllerMetadata> = {}
    private routes: RouteMetadata[] = []
    private args: ArgMetadata[] = []
    private fields: InputFieldMetadata[] = []

    private buildRoute(route: RouteMetadata) {
        const { controller, propertyKey, path, method } = route
        const router = Router()
        const {
            path: controllerPath,
            target
        } = this.controllers[controller]

        const argMetadata = this.args.find(metadata =>
            metadata.propertyKey === propertyKey
                && metadata.controller === controller)
        const fields = this.fields.filter(metadata =>
            metadata.target.constructor.name === argMetadata?.target.name)

        const controllerObject: RestController = Container.get(target)
        const handler = async (req: Request, res: Response) => {
            const { args, errors } = validate(req.body, fields, argMetadata)

            if (errors) {
                res.status(400).send({ errors })

                return
            }

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

    storeArgMetadata(data: ArgMetadata) {
        this.args.push(data)
    }

    storeInputField(data: InputFieldMetadata) {
        this.fields.push(data)
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
