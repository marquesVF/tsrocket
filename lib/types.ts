import { ConnectionOptions } from 'typeorm'

export type ServerConfiguration = {
    port: number
    controllers: string[]
    database: ConnectionOptions
}

export interface ResponseInterceptor {
    intercept(response: any, errors?: Error[]): Promise<any> | any
}

export interface InjectableFactory {
    getInstance(): Object
}
