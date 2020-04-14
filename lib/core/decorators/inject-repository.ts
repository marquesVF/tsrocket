import { Container } from '../container'

export function InjectRepository(value: Function): Function {
    return function (target: Object, propertyName: string, index?: number) {
        Container.registerHandler({
            target,
            propertyName,
            index,
            instance: Container.get('connection').getCustomRepository(value)
        })
    }
}
