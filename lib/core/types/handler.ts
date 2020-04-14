export interface Handler {
    target: any
    propertyName: string
    index?: number
    value: () => any
}
