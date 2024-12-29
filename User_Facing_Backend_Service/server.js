import { readFileSync } from 'fs';
import https from 'https'
import cluster from 'cluster'
import os from 'os'
import app from './app.js'
import logger from './helpers/Logger.js'

// HTTPS Certificate
const options = {
    key: readFileSync('key.pem'),
    cert: readFileSync('cert.pem')
};

if (cluster.isPrimary) {
    logger.log('debug', "Master " + process.pid + " is running");

    let cpuCount = os.cpus().length / 4;

    for (let i = 1; i <= cpuCount; i++) {
        const portNumber = parseInt(process.env.PORT) + 1;
        process.env.PORT = portNumber;
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        logger.log('debug', "Worker " + worker.process.pid + " died");
        cluster.fork();
    });
}
else {
    const server = https.createServer(options, app);
    server.listen(process.env.PORT, () => {
        logger.log('debug', `Example app listening on port ${process.env.PORT}`)
    })
}

