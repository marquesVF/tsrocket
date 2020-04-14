export type RestResponse = string | object

export type Context<T> = {
    params?: T
}

export abstract class RestController {

    [key: string]: any

}
