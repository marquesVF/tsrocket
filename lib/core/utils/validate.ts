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
    body: any,
    fields: InputFieldMetadata[],
    arg?: ArgMetadata
): ValidationResult {
    if (!arg) { return { args: {} } }

    const errors: ValidationError[] = []
    const argsObj = new arg.target()
    fields.forEach(field => {
        const { propertyKey, nullable } = field
        const value = body[field.propertyKey]

        if (!nullable && value === undefined) {
            errors.push({
                type: 'MISSING_FIELD',
                message: `'${propertyKey}' field is missing`
            })
        }

        argsObj[field.propertyKey] = body[field.propertyKey]
    })

    return { args: argsObj, errors: errors.length > 0 ? errors : undefined }
}
