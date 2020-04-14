import { Request } from 'express'

export type RestResponse = string | object

export type Context = {
    req: Request
}

export abstract class RestController {

    [key: string]: any

}
