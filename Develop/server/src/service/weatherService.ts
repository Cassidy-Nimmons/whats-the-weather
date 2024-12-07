import dotenv from 'dotenv';
//import fetch from 'node-fetch'; 
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}
// TODO: Define a class for the Weather object
class Weather {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;

    constructor(temperture: number, description: string, humidity: number, windSpeed: number, icon: string) {
      this.temperature = temperture;
      this.description = description;
      this.humidity = humidity;
      this.windSpeed = windSpeed;
      this.icon = icon;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string = process.env.API_BASE_URL || '';
  private apiKey: string = process.env.API_KEY || '';
  //private cityName: string = '';


  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const geocodeURL = this.buildGeocodeQuery(query);
    const response = await fetch(geocodeURL);
    const data = await response.json();
    return this.destructureLocationData(data);
    }
   // return await reponse.json();

    private destructureLocationData(locationData: any): Coordinates {
      const { latitude, longitude } = locationData[0]; // Assuming the response contains an array with city coordinates
      return { latitude, longitude };
    }

    private buildGeocodeQuery(query: string): string {
      return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    }
    private buildWeatherQuery(coordinates: Coordinates): string {
      const { latitude, longitude } = coordinates;
      return `${this.baseURL}forecast?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`;
    }
    private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
      const locationData = await this.fetchLocationData(query);
      return locationData;
    }
    private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
      const weatherQuery = this.buildWeatherQuery(coordinates);
      const response = await fetch(weatherQuery);
      const data = await response.json();
      return data;
    }
    private parseCurrentWeather(response: any): Weather {
      const { main, weather, wind } = response;
      const temperature = main.temp;
      const description = weather[0].description;
      const humidity = main.humidity;
      const windSpeed = wind.speed;
      const icon = weather[0].icon;
      return new Weather(temperature, description, humidity, windSpeed, icon);
    }
    async getWeatherForCity(city: string): Promise<Weather> {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      return currentWeather;
    }
  }

  export default new WeatherService();
  
 