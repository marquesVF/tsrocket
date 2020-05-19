export interface InjectionMetadata {
    target: any
    propertyName: string
    index?: number
    instance: () => any
}
