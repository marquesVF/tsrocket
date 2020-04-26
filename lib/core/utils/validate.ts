import { Request } from 'express'

import { ArgMetadata, InputFieldMetadata } from '../metadata/types'
import { ValidationResult, ValidationError } from '../types/validation'

/**
 * This method verifies if all the required fields are included in a request
 *
 * @param {*} body
 * @param {InputFieldMetadata[]} fields
 * @param {ArgMetadata} [arg]
 * @returns {ValidationResult}
 */
export function validate(
    req: Request,
    fields: InputFieldMetadata[],
    arg?: ArgMetadata
): ValidationResult {
    if (!arg) { return { parameters: {} } }

    const errs: ValidationError[] = []
    const argsObj = new arg.target()
    fields.forEach(field => {
        const { propertyKey, nullable } = field
        const reqArgs = req[arg.type]
        const value = reqArgs[field.propertyKey]

        if (!nullable && value === undefined) {
            errs.push({
                type: 'MISSING_FIELD',
                message: `'${propertyKey}' field is missing`
            })
        }

        argsObj[field.propertyKey] = reqArgs[field.propertyKey]
    })

    return { parameters: argsObj, errors: errs.length > 0 ? errs : undefined }
}
