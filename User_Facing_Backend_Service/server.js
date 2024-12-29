import http from 'http'
import cluster from 'cluster'
import os from 'os'
import app from './app.js'
import logger from './helpers/Logger.js'

if (cluster.isPrimary)
{
    logger.log('debug', "Master " + process.pid + " is running");

    let cpuCount = os.cpus().length / 4;

    for (let i = 1; i <= cpuCount; i++)
    {
        const portNumber = parseInt(process.env.PORT) + 1;
        process.env.PORT = portNumber;
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        logger.log('debug', "Worker " + worker.process.pid + " died");
        cluster.fork();
    });
}
else
{
    const server = http.createServer(app);
    server.listen(process.env.PORT, () => {
        logger.log('debug', `Example app listening on port ${process.env.PORT}`)
    })
}

