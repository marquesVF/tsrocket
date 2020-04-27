import { RequestMethod } from '../metadata/types'

export function requestStatus(method: RequestMethod): number {
    switch (method) {
        case 'post':
            return 201
        default:
            return 200
    }
}
