type GeneratorArgument = {
    name: string
}

export type InjectableDomain = 'service' | 'controller'

export type ModelGeneratorArguments = GeneratorArgument & {
    properties?: string[]
}

export type InjectableGeneratorArguments = GeneratorArgument & {
    services: string[]
}
