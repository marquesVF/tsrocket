import { Handler } from './types/handler'
import { ServiceIdentifier } from './types/service-identifier'
import { ServiceMetadata } from './metadata/definitions'

export class Container {

    private static services: ServiceMetadata[] = []
    private static handlers: Handler[] = []

    static set(target: ServiceIdentifier) {
        this.services.push({ target, value: Container.get(target) })
    }

    static get(target: ServiceIdentifier): any {
        const service = this.services.find(service => service.target === target)

        let value: any
        if (!service) {
            value = new target()
            this.services.push({ target, value })
        } else {
            value = service.value
        }

        const registeredHandlers = this.handlers.filter(handler =>
            handler.target.constructor === value.constructor)

        registeredHandlers.forEach(handler => {
            Object.defineProperty(value, handler.propertyName, {
                value: handler.value
            })
        })

        return value
    }

    static registerHandler(handler: Handler) {
        this.handlers.push(handler)
    }

}
