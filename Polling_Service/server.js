import { readFileSync } from 'fs';
import http from 'http'
import app from './app.js';
import logger from './helpers/Logger.js';

// Routes
import { PollAPIsForData } from './controllers/weather.js';

const server = http.createServer(app);

server.listen(process.env.PORT, () =>
{
    logger.info(`Example app listening on port ${process.env.PORT}`);

    setInterval(() => {
        PollAPIsForData().then(() => {
            logger.log('debug', 'Poll complete');
        }).catch(error => {
            logger.log('error', error);
        });
    }, process.env.POLLING_INTERVAL);
})
