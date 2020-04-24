import { Identifier } from '../types/identifier'

export type RouteArguments = {
    target: Object
    propertyKey: string | symbol
    method: RequestMethod
    path: string
}

export type RequestMethod = 'get' | 'post' | 'delete'

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

export type ContainerMetadata = {
    id: Identifier
    instance: any
}
