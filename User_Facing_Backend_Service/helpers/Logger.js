import logger from 'winston'

logger.configure({
    transports: [
        new (logger.transports.File)({ filename: 'LogFile.log' })
    ]
});

logger.level = 'debug'

export default logger