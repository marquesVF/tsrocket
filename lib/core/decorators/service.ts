import { Container } from '../container'

export function Service(): ClassDecorator {
    return function (target: Function) {
        Container.set(target)
    }
}
