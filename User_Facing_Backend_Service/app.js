import bodyParser from 'body-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import cors from 'cors'
import express from 'express';
import { serve, setup } from 'swagger-ui-express';

import logger from './helpers/Logger.js';

// Routes
import weather from "./controllers/weather.js";

const app = express()
app.use(cors({ credentials: true }))

// Swagger
// TODO do the swagger APIs
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'CoPay Real-Time Weather Application',
            version: '1.0.0',
            description: 'This set of APIs allows the website to deliver the requested functionalities',
            contact: {
                name: 'Fady Mohamed'
            },
            servers: ["https:localhost"]
        }
    },
    // ['.routes/*.js']
    apis: ["./controllers/weather.js"]
};

// controllers
app.use('/weather', weather)

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', serve, setup(swaggerDocs))
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