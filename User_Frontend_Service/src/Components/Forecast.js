import React from "react";
import { useApiPolling } from "../helpers/utils";
import logger from "../helpers/logger";

const foreCastHoltWinterURL = `${process.env.REACT_APP_BACKEND_ENDPOINT}/GetForecast?Algorithm=HoltWinter`;
const foreCastExponentialWeightedAverageURL = `${process.env.REACT_APP_BACKEND_ENDPOINT}/GetForecast?Algorithm=ExponentialWeightedAverage`;

async function getDataFromApi() {
    try {
        const holtWinterResponse = await fetch(foreCastHoltWinterURL);
        const exponentialWeightedAverageResponse = await fetch(foreCastExponentialWeightedAverageURL);
        if (!holtWinterResponse.ok || !exponentialWeightedAverageResponse.ok) {
            logger.error(`Network response was not ok`);
            throw new Error(`Network response was not ok`);
        }

        const holtWinterJson = await holtWinterResponse.json();
        const exponentialWeightedAverageJson = await exponentialWeightedAverageResponse.json();

        let jsonData = {
            HoltWinter: holtWinterJson.Message.temperature,
            ExponentialWeightedAverage: exponentialWeightedAverageJson.Message.temperature
        };

        return jsonData;
    } catch (error) {
        logger.error(error);
    }
}

const Forecast = () => {

    let data = useApiPolling(getDataFromApi, process.env.REACT_APP_WEATHER_FORECAST_POLLING_INTERVAL);

    let holtWinterTemperature = 30;
    let exponentialWeightedAverageTemperature = 30;

    if (data != null) {
        holtWinterTemperature = parseFloat(data.HoltWinter).toFixed(2);
        exponentialWeightedAverageTemperature = parseFloat(data.ExponentialWeightedAverage).toFixed(2);
    }

    if (data != null) {
        return (
            <React.Fragment>
                <div className="forecastWeather">
                    <div className="weather_main" >
                        <h1 className="temp">Temperature in the next hour using Holt Winter: {holtWinterTemperature} C</h1>
                        <h1 className="temp">Temperature in the next hour using Exponential Moving Average: {exponentialWeightedAverageTemperature} C</h1>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

export default Forecast;