import { Request } from 'express'
import { validateSync } from 'class-validator'

import { ArgMetadata, FieldMetadata } from '../metadata/types'
import {
    ValidationResult,
    ValidationError,
    ErrorType
} from '../types/validation'

/**
 * This method verifies if all the required fields are included in a request
 */
export function validateRequestParameters(
    req: Request,
    fields: FieldMetadata[],
    argMetadatas: ArgMetadata[]
): ValidationResult {
    if (argMetadatas.length === 0) { return { parameters: [{}] } }

    const errs: ValidationError[] = []
    const returnedArguments: any[] = []

    argMetadatas.forEach(arg => {
        const { type, target, index  } = arg

        const targetFields = fields.filter(metadata =>
            metadata.target.constructor.name === target?.name)

        const reqArgs = req[type]
        const argsObj = target
            ? new target()
            // FIX-ME it may be error prone
            : reqArgs[Object.keys(reqArgs)[index]]

        targetFields.forEach(field => {
            const { propertyKey, options } = field
            const nullable = options?.nullable ?? false
            const value = options && options.transform
                ? options.transform(reqArgs[field.propertyKey])
                : reqArgs[field.propertyKey]

            if (!nullable && value === undefined) {
                errs.push({
                    type: ErrorType.MissingField,
                    message: `'${propertyKey}' field is missing`
                })
            }

            argsObj[field.propertyKey] = value
        })

        if (target) {
            const errors = validateSync(
                argsObj,
                { forbidUnknownValues: true, skipMissingProperties: true }
            )
            const descriptions: string[] = []
            errors.map(err => {
                const { constraints } = err
                if (constraints) {
                    Object.keys(constraints).forEach(key => {
                        descriptions.push(constraints[key])
                    })
                }
            })

            descriptions.forEach(des => errs.push({
                type: ErrorType.TypeValidation,
                message: des
            }))
        }

        returnedArguments[index] = argsObj
    })

    const returnedErrors = errs.length > 0 ? errs : undefined

    return { parameters: returnedArguments, errors: returnedErrors }
}
