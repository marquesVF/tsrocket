import { InjectionHandler } from './types/injection-handler'
import { Identifier } from './types/identifier'
import { ContainerMetadata } from './metadata/types'

export class Container {

    private static injectables: ContainerMetadata[] = []
    private static handlers: InjectionHandler[] = []

    /**
     * Set a Container instance to an id. If no instance is passed as argument
     * it sets to an existing tsrocket Service instance with the associated id.
     *
     * @static
     * @param {Identifier} id
     * @param {*} [instance]
     */
    static set(id: Identifier, instance?: any) {
        this.injectables.push({
            id,
            instance: instance ?? Container.get(id)
        })
    }

    static get(id: Identifier): any {
        const serviceMetadata = this
            .injectables
            .find(injectable => injectable.id === id)

        let injectableInstance: any
        if (!serviceMetadata) {
            injectableInstance = new id()
            this.injectables.push({ id, instance: injectableInstance })
        } else {
            injectableInstance = serviceMetadata.instance
        }

        const registeredHandlers = this.handlers.filter(handler =>
            handler.target.constructor === injectableInstance.constructor)

        registeredHandlers.forEach(handler => {
            const { propertyName, instance } = handler

            Reflect.set(injectableInstance, propertyName, instance)
        })

        return injectableInstance
    }

    static registerHandler(handler: InjectionHandler) {
        this.handlers.push(handler)
    }

}
