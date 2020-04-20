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

// TODO logger level should be a parameter
export default logger('debug')
