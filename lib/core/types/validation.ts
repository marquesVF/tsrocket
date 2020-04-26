export type ErrorType =
    | 'MISSING_FIELD'

export type ValidationError = {
    type: ErrorType
    message: string
}

export type ValidationResult = {
    args: any
    errors?: ValidationError[]
}
