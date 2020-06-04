import { Container } from '../container'
import { InjectableFactory } from '../../types'

export function Service(
    factory?:  new (...args: any[]) => InjectableFactory
): ClassDecorator {
    let instance: InjectableFactory
    if (factory) {
        const factoryInstance = Container.get(factory)
        instance = factory ? factoryInstance.getInstance() : undefined
    }

    return function (target: Function) {
        Container.set(target, instance)
    }
}
