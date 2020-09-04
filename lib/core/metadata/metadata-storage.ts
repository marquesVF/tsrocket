import { Express, Router, Request, Response } from 'express'
import { ObjectHandler } from 'objectypes'

import { sanitizePath } from '../utils/sanitizers'
import { RestController } from '../rest-controller'
import { Container } from '../container'
import { requestStatus } from '../utils/request'
import { Logger } from '../../logger'
import { getMilliseconds } from '../../utils/time'
import { Server } from '../server'
import { ResponseInterceptor } from '../../types'
import { mapResponse } from '../utils/map-response'
import { validateDto } from '../route/dto-validator'

import {
    ControllerMetadata,
    RouteMetadata,
    ArgMetadata,
    ResponseInterceptorMetadata
} from './types'

export class MetadataStorage {

    private static _storage = new MetadataStorage()
    private controllers: Record<string, ControllerMetadata> = {}
    private routes: RouteMetadata[] = []
    private args: ArgMetadata[] = []
    private controllerResponseInterceptors: ResponseInterceptorMetadata[] = []

    private findResponseInterceptor(controller: string): ResponseInterceptor {
        const controllerInterceptor = this.controllerResponseInterceptors
            .find(inter => inter.controller === controller)

        if (controllerInterceptor) {
            const { interceptor } = controllerInterceptor

            return interceptor
        }

        return Server.globalResponseInterceptor
    }

    private buildRoute(route: RouteMetadata) {
        const { controller, propertyKey, path, method, dto } = route
        const router = Router()
        const {
            path: controllerPath,
            target
        } = this.controllers[controller]

        const argMetadata = this.args.filter(metadata =>
            metadata.propertyKey === propertyKey
                && metadata.controller === controller)

        const interceptor = this.findResponseInterceptor(controller)

        const controllerObject: RestController = Container.get(target)
        const handler = async (req: Request, res: Response) => {
            const result = validateDto(req.body, dto)

            if (typeof result === 'string') {
                res.status(400).send(interceptor.intercept(undefined, result))

                return
            }

            const requestDestination = controllerObject.constructor.name
            try {
                const processStart = getMilliseconds()
                const result
                    = await controllerObject[propertyKey](...parameters)
                const timeConsumed = getMilliseconds() - processStart

                const mappedResponse = dto
                    ? mapResponse(mapper, this.fields, result)
                    : result
                const response = interceptor.intercept(mappedResponse)

                // eslint-disable-next-line max-len
                Logger.info(`[${method}] request to ${requestDestination} '${path}' ${timeConsumed} ms`)

                res.status(requestStatus(method)).send(response)
            } catch (err) {
                // eslint-disable-next-line max-len
                Logger.error(`processing the request to ${requestDestination} '${path}': ${err}`)
                const response = interceptor.intercept(undefined, [err])

                res.status(500).send(response)
            }
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

    storeResponseInterceptor(data: ResponseInterceptorMetadata) {
        this.controllerResponseInterceptors.push(data)
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
