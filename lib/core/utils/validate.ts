/* eslint-disable no-useless-constructor */
import { Request } from 'express'
import { validateSync } from 'class-validator'

import { ArgMetadata, FieldMetadata, ClassType } from '../metadata/types'
import {
    ValidationResult
} from '../types/validation'
import {
    ValidationError,
    MissingFieldError,
    TypeValidationError
} from '../errors/validation'

import { fieldFilter } from './field-filter'

export class RequestParamsValidator {

    private readonly errs: ValidationError[] = []
    private readonly returnedArguments: any[] = []

    constructor(
        private readonly req: Request,
        private readonly fields: FieldMetadata[],
        private readonly argMetadatas: ArgMetadata[]
    ) {}

    private validateTargetFields(target: ClassType, reqArgs: any): any {
        const argsObj = new target()
        const targetFields = this.fields
            .filter(field => fieldFilter(field, target))

        targetFields.forEach(field => {
            const { propertyKey, options } = field
            const nullable = options?.nullable || false

            const value = reqArgs[field.propertyKey]
            if (!nullable && value === undefined) {
                this.errs.push(
                    new MissingFieldError(`'${propertyKey}' field is missing`)
                )
            }

            const transformedValue = value && options && options.transform
                ? options.transform(reqArgs[field.propertyKey])
                : value

            if (!nullable && options?.type) {
                const nestedMapper = options.type
                argsObj[field.propertyKey] = this
                    .validateTargetFields(nestedMapper, transformedValue)
            } else {
                argsObj[field.propertyKey] = transformedValue
            }
        })

        const errors = validateSync(
            argsObj,
            { forbidUnknownValues: true, skipMissingProperties: true }
        )
        const descriptions: string[] = []
        errors.map(err => {
            const { constraints } = err
            if (constraints) {
                Object.keys(constraints).forEach(key => {
                    const description = constraints[key]

                    // It should ignore if the DTO does not use class-validation
                    // eslint-disable-next-line max-len
                    if (description !== 'an unknown value was passed to the validate function') {
                        descriptions.push(description)
                    }
                })
            }
        })

        descriptions.forEach(des =>
            this.errs.push(new TypeValidationError(des)))

        return argsObj
    }

    /**
     * This method verifies if all the required fields are included in a request
     */
    validate(): ValidationResult {
        if (this.argMetadatas.length === 0) { return { parameters: [{}] } }

        this.argMetadatas.forEach(arg => {
            const { type, target, index  } = arg

            const reqArgs = this.req[type]
            const argsObj = target
                ? this.validateTargetFields(target, reqArgs)
                // FIX-ME it may be error prone
                : reqArgs[Object.keys(reqArgs)[index]]

            this.returnedArguments[index] = argsObj
        })

        const returnedErrors = this.errs.length > 0 ? this.errs : undefined

        return { parameters: this.returnedArguments, errors: returnedErrors }
    }

}
