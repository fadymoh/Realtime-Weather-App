import logger from '../helpers/Logger.js';

class WeatherModel
{
    constructor(timeStamp, humidity, temperature, windSpeed, direction, cloudCover, APIDataPoint)
    {
        this.timeStamp = timeStamp;
        this.humidity = humidity;
        this.temperature = temperature;
        this.windSpeed = windSpeed;
        this.direction = direction;
        this.cloudCover = cloudCover;
        this.APIDataPoint = APIDataPoint;
    }

    Display()
    {
        logger.log('debug', `Humidity: ${this.humidity}`);
        logger.log('debug', `Temperature: ${this.temperature}`);
        logger.log('debug', `Wind Speed: ${this.windSpeed}`);
        logger.log('debug', `Wind Direction: ${this.direction}`);
        logger.log('debug', `Cloud Cover: ${this.cloudCover}`);
        logger.log('debug', `TimeStamp: ${this.timeStamp}`);
    }
};

export { WeatherModel };