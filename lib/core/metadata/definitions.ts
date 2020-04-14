import { Identifier } from '../types/identifier'

export interface ControllerMetadata {
    path: string
    controller: string
    target: any
}

export type RouteMetadata = {
    path: string
    method: string
    controller: string
}

export type ContainerMetadata = {
    id: Identifier
    instance: any
}
