import logger from 'winston'

logger.configure({
   transports: [
       new (logger.transports.File)({ filename: 'LogFile.log' })
   ]
});

logger.level = process.env.LOG_LEVEL || 'debug'

export default logger