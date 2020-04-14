import { InjectionHandler } from './types/injection-handler'
import { ServiceIdentifier } from './types/service-identifier'
import { ContainerMetadata } from './metadata/definitions'

export class Container {

    private static services: ContainerMetadata[] = []
    private static handlers: InjectionHandler[] = []

    /**
     * Set a Container instance to an id. If no instance is passed as argument
     * it sets to an existing tsrocket Service instance with the associated id.
     *
     * @static
     * @param {ServiceIdentifier} id
     * @param {*} [instance]
     */
    static set(id: ServiceIdentifier, instance?: any) {
        this.services.push({
            id,
            instance: instance ?? Container.get(id)
        })
    }

    static get(id: ServiceIdentifier): any {
        const serviceMetadata = this
            .services
            .find(service => service.id === id)

        let serviceInstance: any
        if (!serviceMetadata) {
            serviceInstance = new id()
            this.services.push({ id, instance: serviceInstance })
        } else {
            serviceInstance = serviceMetadata.instance
        }

        const registeredHandlers = this.handlers.filter(handler =>
            handler.target.constructor === serviceInstance.constructor)

        registeredHandlers.forEach(handler => {
            Object.defineProperty(serviceInstance, handler.propertyName, {
                value: handler.instance
            })
        })

        return serviceInstance
    }

    static registerHandler(handler: InjectionHandler) {
        this.handlers.push(handler)
    }

}
