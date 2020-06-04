export const DtoValidator: Record<string, string> = {
    string: 'IsString',
    email: 'IsEmail',
    date: 'IsDate',
    number: 'IsNumber',
    boolean: 'IsBoolean'
}

export function processType(type: string): string {
    switch (type) {
        case 'email':
            return 'string'
        case 'date':
            return 'Date'
        default:
            return type
    }
}

export function processFieldOptions(
    type: string,
    nullable: boolean
): string | undefined {
    const options: string[] = []
    switch (type) {
        case 'date':
            options.push('transform: (value: string) => new Date(value)')
            break
        default:
            break
    }

    if (nullable) {
        options.push('nullable: true')
    }

    return options.length > 0 ? `{ ${options.join(', ')} }` : undefined
}
