import { Request } from 'express'

import { ArgMetadata, InputFieldMetadata } from '../metadata/types'
import { ValidationResult, ValidationError } from '../types/validation'

/**
 * This method verifies if all the required fields are included in a request
 */
export function validateRequestParameters(
    req: Request,
    fields: InputFieldMetadata[],
    argMetadatas: ArgMetadata[]
): ValidationResult {
    if (argMetadatas.length === 0) { return { parameters: [{}] } }

    const errs: ValidationError[] = []
    const returnedArguments: any[] = []

    argMetadatas.forEach(arg => {
        const { type, target, propertyKey } = arg

        const targetFields = fields.filter(metadata =>
            metadata.target.constructor.name === target?.name)

        const reqArgs = req[type]
        const argsObj = target ? new target() : reqArgs[propertyKey]

        targetFields.forEach(field => {
            const { propertyKey, nullable } = field
            const value = reqArgs[field.propertyKey]

            if (!nullable && value === undefined) {
                errs.push({
                    type: 'MISSING_FIELD',
                    message: `'${propertyKey}' field is missing`
                })
            }

            argsObj[field.propertyKey] = value
        })

        returnedArguments[arg.index] = argsObj
    })

    const returnedErrors = errs.length > 0 ? errs : undefined

    return { parameters: returnedArguments, errors: returnedErrors }
}
