import bodyParser from 'body-parser';
import cors from 'cors'
import express from 'express';
import logger from './helpers/Logger.js';

const app = express()
app.use(cors({ credentials: true }))

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

// global error handler
app.use(function (err, req, res, next)
{    
    logger.log('error', err.message)

    return res.status(500).json({
        Message: null,
        ErrorMessage: err.message
    })
})

export default app