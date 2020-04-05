import { Request } from 'express'

export type RestResponse = string | object

export type Context = {
    req: Request
}

export class RestController {

    [key: string]: any

}
