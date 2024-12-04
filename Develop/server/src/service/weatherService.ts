import dotenv from 'dotenv';
import fetch from 'node-fetch'; 
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}
// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public temprature: number,
    public description: string,
    public humidity: number,
    public windSpeed: number,
    public wcityNsme: string,
  ) {}
}
// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string = 'https://api.openweathermap.org/data/2.5';
  private apiKey: string = process.env.OPENWEATHER_API_KEY || '';
  private cityName: string = '';

  private async fetchLocationData(query: string): Promise<any> {
    const url = this.buildGeocodeQuery(query);
    const reponse = await fetch(url);
    if (!reponse.ok) {
      throw new Error(`Failed to fetch location data: ${reponse.statusText}`);
    }
    return await reponse.json();
  }
  
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
