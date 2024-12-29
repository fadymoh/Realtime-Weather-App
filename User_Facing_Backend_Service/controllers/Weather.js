import 'dotenv/config';
import { Router, json } from 'express';
import { db } from '../helpers/DatabaseConnector.js';
import logger from '../helpers/Logger.js';
import { cache } from '../helpers/CacheConnector.js';

var router = Router();
router.use(json())

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

router.get('/GetForecast', CacheMiddleware, async (req, res) => {

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
        cache.set("Forecast" + req.query.Algorithm, model, 20).then(function (result) {
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
    cache.get("Forecast" + req.query.Algorithm).then(function (results) {
        if (results.err) {
            logger.log("error", results.err);
        } else {
            if (results.value.Forecast !== undefined) {
                res.json({
                    Message: results.value.Forecast,
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