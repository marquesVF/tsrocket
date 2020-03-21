import { Request } from "express"
import { App } from "./app"
import { Controller } from "./controller"

export type RouteMethod = 'get' | 'post'

export function GET(path: string) {
    return function(
        _: Controller,
        __: string,
        descriptor: PropertyDescriptor
    ) {
        App.registerGet(path, descriptor.value)
    }
}

export type Context = {
    req: Request
    args: Record<string, string>
}

export type Response = string | Object