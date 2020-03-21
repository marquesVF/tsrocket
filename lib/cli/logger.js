const { createLogger, format, transports } = require('winston')

function logger(level) {
    const formats = [
        format.colorize(),
        format.splat(),
        format.simple(),
    ]

    return createLogger({
        level,
        transports: [new transports.Console()],
        format: format.combine(...formats)
    })
}

module.exports = logger