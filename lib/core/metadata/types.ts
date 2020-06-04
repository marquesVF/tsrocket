import { Identifier } from '../types/identifier'
import { ResponseInterceptor } from '../../types'
import { FieldOptions } from '../types/decorator-types'

export type RouteArguments = {
    target: Object
    propertyKey: string | symbol
    method: RequestMethod
    path: string
}

export type RequestMethod = 'get' | 'post' | 'delete' | 'put'

export interface ControllerMetadata {
    path: string
    controller: string
    target: any
}

export type RouteMetadata = {
    method: RequestMethod
    path: string
    propertyKey: string
    controller: string
}

export type InjectableMetadata = {
    id: Identifier
    instance: Object
}

export type ArgType = 'body' | 'query' | 'params'

export type ClassType = new (...args: any[]) => any

export type ArgMetadata = {
    type: ArgType
    target?: ClassType
    controller: string
    propertyKey: string
    index: number
}

export type InputFieldMetadata = {
    target: any
    propertyKey: string
    options?: FieldOptions
}

export type ResponseInterceptorMetadata = {
    interceptor: ResponseInterceptor
    controller: string
}
