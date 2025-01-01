import 'dotenv/config';
import { Router, json } from 'express';
import { db } from '../helpers/DatabaseConnector.js';
import logger from '../helpers/Logger.js';
import { cache } from '../helpers/CacheConnector.js';

var router = Router();
router.use(json())


/**
 * @swagger
 * /weather/GetLatestWeather:
 *   get:
 *     summary: Returns the latest weather data based on the average of responses from OpenWeatherAPI and TomorrowAPI
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                Message:
 *                 type: object
 *                 properties:
 *                  humidity:
 *                   type: number
 *                   example: 50
 *                  temperature:
 *                   type: number
 *                   example: 15
 *                  windSpeed:
 *                   type: number
 *                   example: 20
 *                  visibility:
 *                   type: number
 *                   example: 10000
 *                  pressure:
 *                   type: number
 *                   example: 1000
 *                ErrorMessage:
 *                 type: string
 *                 example: null
 *       500:
 *        description: An error occurred
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *            Message:
 *             type: string
 *             example: null
 *            ErrorMessage:
 *             type: string
 *             example: An error occurred
 */
router.get('/GetLatestWeather', async (req, res) => {

    // Setup the query
    const queryApi = db.getQueryApi(process.env.INFLUXDB_ORG);
    const fluxQuery = `from(bucket: "${process.env.INFLUXDB_BUCKET}") |> range(start: 0) |> filter(fn: (r) => r._measurement == "WeatherModel") |> last()`

    const model = {};

    const myQuery = async () => {
        for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
            const row = tableMeta.toObject(values)
            model[row._field] = row._value
        }
    }

    // Execute the query
    myQuery().then(() => {
        res.status(200).json(
            {
                Message: model,
                ErrorMessage: null
            });
    }).catch((err) => {
        console.log(err);
        res.status(500).json(
            {
                Message: null,
                ErrorMessage: err.message
            });
    });
})

/**
 * @swagger
 * /weather/GetForecast:
 *   get:
 *     summary: Returns the forecasted weather for the next 1 hour based on the data from the previous 3 hours using the specified algorithm
 *     parameters:
 *      - in: query
 *        name: Algorithm
 *        schema:
 *         type: string
 *         enum: [HoltWinter, ExponentialWeightedAverage]
 *        required: true
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                Message:
 *                 type: object
 *                 properties:
 *                  temperature:
 *                   type: number
 *                   example: 15
 *                ErrorMessage:
 *                 type: string
 *                 example: null
 *       500:
 *        description: An error occurred
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *            Message:
 *             type: string
 *             example: null
 *            ErrorMessage:
 *             type: string
 *             example: An error occurred
 */
router.get('/GetForecast', CacheMiddleware, async (req, res) => {

    // Setup Algorithm
    if (req.query.Algorithm == null || (req.query.Algorithm != "HoltWinter" && req.query.Algorithm != "ExponentialWeightedAverage"))
    {
        res.status(400).json({
            Message: null,
            ErrorMessage: "Algorithm is required, the provided algorithm value is: " + req.query.Algorithm
        });
    }

    // Setup the query
    const queryAPI = db.getQueryApi(process.env.INFLUXDB_ORG);
    let fluxQuery;

    if (req.query.Algorithm == "HoltWinter") {
        fluxQuery = `from(bucket: "RTWeatherApp") 
            |> range(start: -3h)
            |> filter(fn: (r) => r["_measurement"] == "WeatherModel")
            |> filter(fn: (r) => r["_field"] == "temperature")
            |> filter(fn: (r) => r["temperature"] == "temperature")
            |> holtWinters(n: 1, interval: 60m)`;
    }
    else if (req.query.Algorithm == "ExponentialWeightedAverage") {
        fluxQuery = `from(bucket: "RTWeatherApp")
            |> range(start: -1h)
            |> filter(fn: (r) => r["_measurement"] == "WeatherModel")
            |> filter(fn: (r) => r["_field"] == "temperature")
            |> filter(fn: (r) => r["temperature"] == "temperature")
            |> exponentialMovingAverage(n: 12)
            |> last()`
    }

    const model = {};

    const myQuery = async () => {
        for await (const { values, tableMeta } of queryAPI.iterateRows(fluxQuery)) {
            const row = tableMeta.toObject(values)
            model[row._field] = row._value
        }
    }

    // Execute the query
    myQuery().then(() => {
        cache.set("Forecast" + req.query.Algorithm, model, 60).then(function (result) {
            if (result.err) {
                logger.log("error", result.err);
            }
        });

        res.status(200).json({
            Message: model,
            ErrorMessage: null,
            CachedData: false
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            Message: null,
            ErrorMessage: err.message
        });
    });
})

function CacheMiddleware(req, res, next) {
    let key = "Forecast" + req.query.Algorithm;
    cache.get(key).then(function (results) {
        if (results.err) {
            logger.log("error", results.err);
        } else {
            if (results.value[key] !== undefined) {
                res.status(200).json({
                    Message: results.value[key],
                    ErrorMessage: null,
                    CachedData: true
                });
            }
            else {
                next();
            }
        }
    });
}

export default router