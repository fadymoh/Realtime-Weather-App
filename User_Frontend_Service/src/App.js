import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import "./styles.css";
import ShowWeather from "./Components/ShowWeather"
import Forecast from "./Components/Forecast"
import logger from './helpers/logger.js'

export default function App() {

    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);

    const latestWeatherURL = `${process.env.REACT_APP_BACKEND_ENDPOINT}/GetLatestWeather`;
    const foreCastHoltWinterURL = `${process.env.REACT_APP_BACKEND_ENDPOINT}/GetForecast?Algorithm=HoltWinter`;
    const foreCastExponentialWeightedAverageURL = `${process.env.REACT_APP_BACKEND_ENDPOINT}/GetForecast?Algorithm=ExponentialWeightedAverage`;

    async function fetchWeatherData(setData) {
        try
        {
            const response = await fetch(latestWeatherURL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();

            setWeatherData(jsonData);
        } catch (error) {
            logger.error('Failed to fetch data:', error);
        }
    }

    async function fetchForecastData(setData) {
        try {
            const holtWinterResponse = await fetch(foreCastHoltWinterURL);
            const exponentialWeightedAverageResponse = await fetch(foreCastExponentialWeightedAverageURL);
            if (!holtWinterResponse.ok || !exponentialWeightedAverageResponse.ok) {
                throw new Error(`Network response was not ok`);
            }

            const holtWinterJson = await holtWinterResponse.json();
            const exponentialWeightedAverageJson = await exponentialWeightedAverageResponse.json();

            let jsonData = {
                HoltWinter: holtWinterJson.Message.temperature,
                ExponentialWeightedAverage: exponentialWeightedAverageJson.Message.temperature
            };

            setForecastData(jsonData);
        } catch (error) {
            logger.error('Failed to fetch data:', error);
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchWeatherData();
        }, process.env.REACT_APP_LIVE_WEATHER_POLLING_INTERVAL);

        return () => clearInterval(intervalId);
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchForecastData();
        }, process.env.REACT_APP_WEATHER_FORECAST_POLLING_INTERVAL);
        return () => clearInterval(intervalId);
    });

    return (
        <div>
            <Header />

            <ShowWeather data={weatherData} />
            <Forecast data={forecastData} />
        </div>
    );
}