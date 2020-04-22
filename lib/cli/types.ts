export type Entity = 'service' | 'controller' | 'model'

export type GeneratorArguments = {
    name: string
    entity: Entity
    options?: string[]
}
