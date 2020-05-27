import { Express, Router, Request, Response } from 'express'

import { sanitizePath } from '../utils/sanitizers'
import { RestController } from '../rest-controller'
import { Container } from '../container'
import { validateRequestParameters } from '../utils/validate'
import { requestStatus } from '../utils/request'
import logger from '../../logger'
import { getMilliseconds } from '../../utils/time'

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

        const argMetadata = this.args.filter(metadata =>
            metadata.propertyKey === propertyKey
                && metadata.controller === controller)

        const controllerObject: RestController = Container.get(target)
        const handler = async (req: Request, res: Response) => {
            const { parameters, errors }
                = validateRequestParameters(req, this.fields, argMetadata)

            if (errors) {
                res.status(400).send({ errors })

                return
            }

            const processStart = getMilliseconds()
            const result = await controllerObject[propertyKey](...parameters)
            const timeConsumed = getMilliseconds() - processStart
            const response = { data: result }

            // eslint-disable-next-line max-len
            logger.info(`[${method}] request to ${controllerObject.constructor.name} '${path}' ${timeConsumed} ms`)

            res.status(requestStatus(method)).send(response)
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
