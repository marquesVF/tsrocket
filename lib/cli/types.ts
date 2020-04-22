export type Domain = 'service' | 'controller' | 'model'

export type GeneratorArguments = {
    name: string
    generator: Domain
    options?: string[]
}
