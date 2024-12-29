import React from "react";

const Forecast = ({ data }) => {

    let holtWinterTemperature = 30;
    let exponentialWeightedAverageTemperature = 30;

    if (data != null) {
        holtWinterTemperature = parseFloat(data.HoltWinter).toFixed(2);
        exponentialWeightedAverageTemperature = parseFloat(data.ExponentialWeightedAverage).toFixed(2);
    }

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
};

export default Forecast;