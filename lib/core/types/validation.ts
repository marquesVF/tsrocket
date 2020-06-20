export enum ErrorType {
    MissingField = 'MISSING_FIELD',
    TypeValidation = 'TYPE_VALIDATION'
}

export type ValidationResult = {
    parameters: any[]
    errors?: Error[]
}
