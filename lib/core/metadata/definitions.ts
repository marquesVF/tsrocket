import { ServiceIdentifier } from '../types/service-identifier'

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
    id: ServiceIdentifier
    instance: any
}
