import { ConnectionOptions } from 'typeorm'

export type ServerConfiguration = {
    port: number
    constrollers: string[]
    database: ConnectionOptions
}
