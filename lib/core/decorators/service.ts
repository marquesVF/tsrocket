import { Container } from '../container'
import { InjectableFactory } from '../../types'

export function Service(factory?: InjectableFactory): ClassDecorator {
    const instance = factory ? factory.getInstance() : undefined

    return function (target: Function) {
        Container.set(target, instance)
    }
}
