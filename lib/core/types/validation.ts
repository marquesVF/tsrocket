export enum ErrorType {
    MissingField = 'MISSING_FIELD',
    TypeValidation = 'TYPE_VALIDATION'
}

export type ValidationError = {
    type: ErrorType
    message: string
}

export type ValidationResult = {
    parameters: any[]
    errors?: ValidationError[]
}
