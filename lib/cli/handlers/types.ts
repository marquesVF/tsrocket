export type GeneratorArgument = {
    name: string
}

type ServiceInjectableData = {
    name: string
    variable: string
}

type RepositoryInjectableData = {
    model: string
    variable: string
}

export type InjectableGeneratorArguments = {
    name: string
    services?: string[]
}

export type ModelGeneratorArguments = {
    name: string
    s: boolean // --service flag
    properties?: string[]
}

export type ServiceData = {
    name: string
    services?: ServiceInjectableData[]
    repository?: RepositoryInjectableData
}

export type ControllerData = ServiceData & {
    path: string
}

export type Column = { [key: string]: any } & {
    name: string
    type: string
    nullable: boolean
}

export type ModelData = {
    name: string
    columns?: Column[]
}

export type RepositoryData = {
    modelClass: string
    modelName: string
}

export type TemplateData =
    | ServiceData
    | ControllerData
    | ModelData
    | RepositoryData

export type Domain =
    | 'service'
    | 'controller'
    | 'model'
    | 'repository'

export type ImportableServiceData = {
    name: string
    variable: string
}
