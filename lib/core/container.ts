import { InjectionMetadata } from './types/injection-metadata'
import { Identifier } from './types/identifier'
import { InjectableMetadata } from './metadata/types'

export class Container {

    private static injectables: InjectableMetadata[] = []
    private static injectionRequests: InjectionMetadata[] = []

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
            // TODO handle object dependency injection when string
            if (typeof id === 'function') {
                injectableInstance = new id()
                this.injectables.push({ id, instance: injectableInstance })
            }
        } else {
            injectableInstance = serviceMetadata.instance
        }

        const injectionRequests = this.injectionRequests.filter(handler =>
            handler.target.constructor === injectableInstance.constructor)

        injectionRequests.forEach(injectionRequest => {
            const { propertyName, instance } = injectionRequest

            Reflect.set(injectableInstance, propertyName, instance)
        })

        return injectableInstance
    }

    static injectionRequest(injection: InjectionMetadata) {
        this.injectionRequests.push(injection)
    }

}
