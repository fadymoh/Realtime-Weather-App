import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import "./styles.css";
import ShowWeather from "./Components/ShowWeather"
import Forecast from "./Components/Forecast"

export default function App() {

    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);

    async function fetchWeatherData(setData) {
        try
        {
            const response = await fetch(`https://localhost/weather/GetLatestWeather`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            console.log(jsonData);
            setWeatherData(jsonData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    async function fetchForecastData(setData) {
        try {
            const holtWinter = "HoltWinter";
            const exponentialWeightedAverage = "ExponentialWeightedAverage";

            const holtWinterURL = `https://localhost/weather/GetForecast?Algorithm=${holtWinter}`;
            const exponentialWeightedAverageURL = `https://localhost/weather/GetForecast?Algorithm=${exponentialWeightedAverage}`;

            const holtWinterResponse = await fetch(holtWinterURL);
            const exponentialWeightedAverageResponse = await fetch(exponentialWeightedAverageURL);
            if (!holtWinterResponse.ok || !exponentialWeightedAverageResponse.ok) {
                throw new Error(`Network response was not ok`);
            }

            const holtWinterJson = await holtWinterResponse.json();
            const exponentialWeightedAverageJson = await exponentialWeightedAverageResponse.json();

            let jsonData = {
                HoltWinter: holtWinterJson.Message.temperature,
                ExponentialWeightedAverage: exponentialWeightedAverageJson.Message.temperature
            };

            console.log(jsonData);
            setForecastData(jsonData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchWeatherData();
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchForecastData();
        }, 10000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <Header />

            <ShowWeather data={weatherData} />
            <Forecast data={forecastData} />
        </div>
    );
}