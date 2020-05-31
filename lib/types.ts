import { ConnectionOptions } from 'typeorm'

export type ServerConfiguration = {
    port: number
    constrollers: string[]
    database: ConnectionOptions
}

export interface ResponseInterceptor {
    intercept(response: any, error?: Error): Promise<any> | any
}
