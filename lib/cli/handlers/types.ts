type ServiceInjectableData = {
    name: string
    variable: string
}

type RepositoryInjectableData = {
    model: string
    variable: string
}

export type GeneratorArgument = {
    name: string
}

export type Column = {
    name: string
    type: string
    validator: string
    fieldOptions?: string
    nullable: boolean
    transformType?: string
}

export type Relation = 'OneToMany' | 'ManyToOne' | 'OneToOne' | 'ManyToMany'

export type ModelRelation = {
    variable: string
    model: string
    modelClass: string
    relation: Relation
    join: boolean
    relationOption?: string
}

export type RelatedModelUpdate = ModelRelation & {
    modelToUpdate: string
}

export type ModelProperty = {
    columns?: Column[]
    relations?: ModelRelation[]
}

export type CrudArgument = {
    name: string
    variable: string
}

export type InjectableGeneratorArguments = {
    name: string
    m: boolean // --model flag
    services?: string[]
}

export type ModelGeneratorArguments = {
    name: string
    s: boolean // --service flag
    c: boolean // --controller flag
    properties?: string[]
}

export type DtoData = {
    name: string
    validatorImports?: string
    fields?: Column[]
}

export type ServiceData = {
    name: string
    services?: ServiceInjectableData[]
    repository?: RepositoryInjectableData
}

export type ControllerData = ServiceData & {
    path: string
    crud?: CrudArgument
}

export type ModelData = ModelProperty & {
    name: string
    imports?: string[]
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
    | 'dto'

export type ImportableServiceData = {
    name: string
    variable: string
}
