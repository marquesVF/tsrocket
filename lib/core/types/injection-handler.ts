export interface InjectionHandler {
    target: any
    propertyName: string
    index?: number
    instance: () => any
}
