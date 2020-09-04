import { ClassConstructor } from 'objectypes'

export type Identifier = any

export interface InjectionMetadata {
    target: any
    propertyName: string
    index?: number
    instance: () => any
}

export type DtoClass = ClassConstructor<unknown>
