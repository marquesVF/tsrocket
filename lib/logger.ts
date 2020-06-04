import { createLogger, format, transports } from 'winston'

function logger(level: string) {
    const formats = [
        format.colorize(),
        format.splat(),
        format.simple()
    ]

    return createLogger({
        level,
        transports: [new transports.Console()],
        format: format.combine(...formats)
    })
}

const logLevel = process.env.LOG ? process.env.LOG : 'info'

export const Logger = logger(logLevel)
