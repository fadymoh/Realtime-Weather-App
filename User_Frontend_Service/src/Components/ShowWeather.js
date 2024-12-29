import React from "react";
import { useApiPolling } from "../helpers/utils";
import logger from "../helpers/logger";

const latestWeatherURL = `${process.env.REACT_APP_BACKEND_ENDPOINT}/GetLatestWeather`;

async function getDataFromApi() {
    try {
        const response = await fetch(latestWeatherURL);
        const data = await response.json();
        return data;
    } catch (error) {
        logger.error(error);
    }
}

const ShowWeather = () =>
{
    let data = useApiPolling(getDataFromApi, process.env.REACT_APP_LIVE_WEATHER_POLLING_INTERVAL);

    let city = "New Cairo";
    let country = "EG";
    let temperature = 30;
    let pressure = 1000;
    let visibility = 10000;
    let humidity = 50;
    let windSpeed = 20;

    if (data != null) {
        temperature = data.Message.temperature;
        pressure = data.Message.pressure;
        visibility = data.Message.visibility;
        humidity = data.Message.humidity;
        windSpeed = parseFloat(data.Message.windSpeed).toFixed(2);
    }

    const pressureInAtm = (pressure / 1000).toFixed(2);
    const visibilityInKM = (visibility / 1000).toFixed(2);

    if (data != null) {
        return (
            <React.Fragment>
                <div className="showWeather">
                    <div className="weather_main" >
                        <h1 className="weather_heading">
                            {city} <br /> <span> {country}</span>
                        </h1>
                        <h3 className="temp">Temperature: {temperature} C</h3>
                        <hr />
                        <div className="weatherData">
                            <p>
                                Pressure <br /> {pressureInAtm} atm{" "}
                            </p>
                            <p>
                                Visibility <br /> {visibilityInKM} Km
                            </p>
                        </div>
                        <div className="weatherData">
                            <p>
                                Humidity: <br /> {humidity}%{" "}
                            </p>
                            <p>
                                Wind Speed: <br /> {windSpeed} Km/h
                            </p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

export default ShowWeather;