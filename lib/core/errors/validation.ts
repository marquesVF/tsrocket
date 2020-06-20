import { ErrorType } from '../types/validation'

export class ValidationError extends Error { }

export class TypeValidationError extends ValidationError {

    name = ErrorType.TypeValidation

    constructor(message: string) {
        super()

        this.message = message
    }

}

export class MissingFieldError extends ValidationError {

    name = ErrorType.MissingField

    constructor(message: string) {
        super()

        this.message = message
    }

}
