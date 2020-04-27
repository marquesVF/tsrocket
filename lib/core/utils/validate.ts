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
    argMetadatas: ArgMetadata[]
): ValidationResult {
    if (argMetadatas.length === 0) { return { parameters: [{}] } }

    const errs: ValidationError[] = []
    const returnedArguments: any[] = []

    argMetadatas.forEach(arg => {
        const filteredFields = fields.filter(metadata =>
            metadata.target.constructor.name === arg?.target.name)

        const argsObj = new arg.target()
        const reqArgs = req[arg.type]

        filteredFields.forEach(field => {
            const { propertyKey, nullable } = field
            const value = reqArgs[field.propertyKey]

            if (!nullable && value === undefined) {
                errs.push({
                    type: 'MISSING_FIELD',
                    message: `'${propertyKey}' field is missing`
                })
            }

            argsObj[field.propertyKey] = reqArgs[field.propertyKey]
        })

        returnedArguments[arg.index] = argsObj
    })

    const returnedErrors = errs.length > 0 ? errs : undefined

    return { parameters: returnedArguments, errors: returnedErrors }
}
