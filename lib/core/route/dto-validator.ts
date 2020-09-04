import { ObjectHandler } from 'objectypes'

import { DtoClass } from '../types'

export function validateDto(args: object, dto?: DtoClass): string | object {
    if (dto === undefined) {
        return args
    }

    const objectHandler = new ObjectHandler(dto)
    const error = objectHandler.validate(args)

    return error
        ? error.summary
        : objectHandler.build(args) as object
}
