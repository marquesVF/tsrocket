import { Request } from "express"
import { App } from "./app"

export type RouteMethod = 'get' | 'post'

function route(method: RouteMethod, targetPath?: string) {
    return function(
        _: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const path = targetPath ?? propertyKey
        const handler = descriptor.value

        if (method === 'get') {
            App.registerGet(path, handler)
        }
    }
}

export function GET(targetPath?: string) {
    return route('get', targetPath)
}

export type Context = {
    req: Request
    args: Record<string, string>
}

export type Response = string | Object