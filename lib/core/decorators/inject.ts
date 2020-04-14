import { Container } from '../container'

export function Inject(value: Function): Function {
    return function (target: Object, propertyName: string, index?: number) {
        Container.registerHandler({
            target,
            propertyName,
            index,
            instance: Container.get(value)
        })
    }
}
