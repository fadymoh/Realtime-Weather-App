import { db } from '../helpers/DatabaseConnector.js';
import { Point } from '@influxdata/influxdb-client';
import logger from '../helpers/Logger.js';

class WeatherModel
{
    constructor(humidity, temperature, windSpeed, visibility, pressure)
    {
        this.humidity = humidity;
        this.temperature = temperature;
        this.windSpeed = windSpeed;
        this.visibility = visibility;
        this.pressure = pressure;
    }

    Display()
    {
        logger.log('debug', `Humidity: ${this.humidity}`);
        logger.log('debug', `Temperature: ${this.temperature}`);
        logger.log('debug', `Wind Speed: ${this.windSpeed}`);
        logger.log('debug', `visibility: ${this.visibility}`);
        logger.log('debug', `pressure: ${this.pressure}`);
    }

    async Save() {
        // Save to InfluxDB
        const apiDataPoint = process.env.INFLUXDB_APIDATAPOINT || 'api_data';

        const writeApi = db.getWriteApi(process.env.INFLUXDB_ORG, process.env.INFLUXDB_BUCKET, 'ns');

        let temperaturePoint = new Point(apiDataPoint)
            .tag('temperature', 'temperature')
            .floatField('temperature', this.temperature);

        let humidityPoint = new Point(apiDataPoint)
            .tag('humidity', 'humidity')
            .floatField('humidity', this.humidity);

        let windSpeedPoint = new Point(apiDataPoint)
            .tag('windSpeed', 'windSpeed')
            .floatField('windSpeed', this.windSpeed);

        let visibilityPoint = new Point(apiDataPoint)
            .tag('visibility', 'visibility')
            .floatField('visibility', this.visibility);

        let pressurePoint = new Point(apiDataPoint)
            .tag('pressure', 'pressure')
            .floatField('pressure', this.pressure);

        writeApi.writePoint(temperaturePoint)
        writeApi.writePoint(humidityPoint)
        writeApi.writePoint(windSpeedPoint)
        writeApi.writePoint(visibilityPoint)
        writeApi.writePoint(pressurePoint)

        try {
            await writeApi.close();
        } catch (error) {
            logger.log('error', error);
        }
    }
};

export { WeatherModel };