import dayjs, { type Dayjs } from 'dayjs'
import dotenv from 'dotenv';
//import fetch from 'node-fetch'; 
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  
 name: string;
 latitude: number;
 longitude: number;
 country: string;
 state: string;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private city = '';

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';
  }


  //private cityName: string = '';


  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    try {
      if (!this.baseURL || !this.apiKey) {
        throw new Error('API base URL or API key not found');
      }

      const response: Coordinates[] = await fetch(query).then((res) =>
        res.json()
      );
      return response[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
   // return await reponse.json();

    private destructureLocationData(locationData: any): Coordinates {
      if (!locationData) {
        throw new Error('City not found');
      }
  
      const { name, latitude, longitude, country, state } = locationData;
  
      const coordinates: Coordinates = {
        name,
        latitude,
        longitude,
        country,
        state,
      };
  
      return coordinates;
    }
  
    private buildGeocodeQuery(): string {
      const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
      return geocodeQuery;
    }
    private buildWeatherQuery(coordinates: Coordinates): string {
      const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=imperial&appid=${this.apiKey}`;
      return weatherQuery;
    }  
    private async fetchAndDestructureLocationData() {
      return await this.fetchLocationData(this.buildGeocodeQuery()).then((data) =>
        this.destructureLocationData(data)
      );
    }  
    private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
      try {
        const response = await fetch(this.buildWeatherQuery(coordinates)).then(
          (res) => res.json()
        );
        if (!response) {
          throw new Error('Weather data not found');
        }
  
        const currentWeather: Weather = this.parseCurrentWeather(
          response.list[0]
        );
  
        const forecast: Weather[] = this.buildForecastArray(
          currentWeather,
          response.list
        );
        return forecast;
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }
    private parseCurrentWeather(response: any): Weather {
      const parsedDate = dayjs.unix(response.dt).format('M/D/YYYY');

      const currentWeather = new Weather(
        this.city,
        parsedDate,
        response.main.temp,
        response.wind.speed,
        response.main.humidity,
        response.weather[0].icon,
        response.weather[0].description || response.weather[0].main
      );
  
      return currentWeather;
    }  
    private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
      const weatherForecast: Weather[] = [currentWeather];
  
      const filteredWeatherData = weatherData.filter((data: any) => {
        return data.dt_txt.includes('12:00:00');
      });
  
      for (const day of filteredWeatherData) {
        weatherForecast.push(
          new Weather(
            this.city,
            dayjs.unix(day.dt).format('M/D/YYYY'),
            day.main.temp,
            day.wind.speed,
            day.main.humidity,
            day.weather[0].icon,
            day.weather[0].description || day.weather[0].main
          )
        );
      }
  
      return weatherForecast;
    }
    async getWeatherForCity(city: string): Promise<Weather> {
      try {
        this.city = city;
        const coordinates = await this.fetchAndDestructureLocationData();
        if (coordinates) {
          const weather = await this.fetchWeatherData(coordinates);
          return weather;
        }
  
        throw new Error('Weather data not found');
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
  

  export default new WeatherService();
  
 