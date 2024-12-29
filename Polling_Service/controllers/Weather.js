import 'dotenv/config';
import axios from 'axios';
import { WeatherModel } from '../models/WeatherModel.js';
import logger from '../helpers/Logger.js';

const PollAPIsForData = async () =>
{
    // Call APIs
    let openWeatherAPIModel = await callOpenWeatherAPIOnIntervals();
    let tomorrowAPIModel = await callTomorrowAPIOnIntervals();

    if (openWeatherAPIModel === undefined && tomorrowAPIModel === undefined)
    {
        logger.log('error', 'API Call Failed');

        return;
    }

    let weather;

    // To Handle failure/rate limiting of APIs
    if (openWeatherAPIModel === undefined) {
        weather = tomorrowAPIModel;
        logger.log("debug", "OpenWeatherAPIModel is undefined");
    }

    if (tomorrowAPIModel === undefined) {
        weather = openWeatherAPIModel;
        logger.log("debug", "Tomorrow is undefined");
    }

    // Aggregate Data into a single model
    const humidity = (openWeatherAPIModel.humidity + tomorrowAPIModel.humidity) / 2;
    const temperature = (openWeatherAPIModel.temperature + tomorrowAPIModel.temperature) / 2;
    const windSpeed = (openWeatherAPIModel.windSpeed + tomorrowAPIModel.windSpeed) / 2;
    const visibility = (openWeatherAPIModel.visibility + tomorrowAPIModel.visibility) / 2;
    const pressure = (openWeatherAPIModel.pressure + tomorrowAPIModel.pressure) / 2;

    // Create Weather Model
    weather = new WeatherModel(humidity, temperature, windSpeed, visibility, pressure);

    // Save Weather Model
    weather.Display();
    try
    {
        await weather.Save();
    }
    catch (error)
    {
        logger.log('error', error);
    }
}

const callOpenWeatherAPIOnIntervals = async () =>
{
    const apiKey = process.env.OPENWEATHERAPI_KEY;

    const lat = process.env.LATITUDE;
    const lon = process.env.LONGITUDE;

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(apiUrl);
        const humidity = response.data.main.humidity;
        const temperature = response.data.main.temp;
        const windSpeed = response.data.wind.speed;
        const visibility = response.data.visibility;
        const pressure = response.data.main.pressure;

        const weather = new WeatherModel(humidity, temperature, windSpeed, visibility, pressure);

        return weather;
    } catch (error) {
        logger.log('error', error.response);
    }
};

const callTomorrowAPIOnIntervals = async (timeStamp) =>
{
    const apiKey = process.env.TOMMORROWAPI_KEY;

    const lat = process.env.LATITUDE;
    const lon = process.env.LONGITUDE;

    const apiUrl = `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${apiKey}&units=metric`;

    try
    {
        // Get Response
        const response = await axios.get(apiUrl);

        // Extract Data
        const humidity = response.data.data.values.humidity;
        const temperature = response.data.data.values.temperature;
        const windSpeed = response.data.data.values.windSpeed;
        const visibility = response.data.data.values.visibility * 1000; // Convert to meters
        const pressure = response.data.data.values.pressureSurfaceLevel;

        // Create Weather Model
        const weather = new WeatherModel(humidity, temperature, windSpeed, visibility, pressure);

        return weather;
    } catch (error) {
        logger.log('error', error.response);
    }
};

export { PollAPIsForData };