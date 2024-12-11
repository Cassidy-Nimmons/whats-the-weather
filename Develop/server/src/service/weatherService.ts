import dayjs, { type Dayjs } from 'dayjs'
import dotenv from 'dotenv'; 
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Location {
  city: string;
  latitude: number;
  longitude: number;
  country: string;
  region: string;
}

class WeatherDetails {
  constructor(
    public cityName: string,
    public date: Dayjs | string,
    public temperature: number,
    public windSpeed: number,
    public humidityLevel: number,
    public weatherIcon: string,
    public description: string
  ) {}
}

class WeatherAPI {
  private apiEndpoint: string | undefined;
  private key: string | undefined;
  private currentCity = '';

  constructor() {
    this.apiEndpoint = process.env.API_BASE_URL;
    this.key = process.env.API_KEY;
  }

  private validateConfig(): void {
    if (!this.apiEndpoint || !this.key) {
      throw new Error('Missing API configuration.');
    }
  }

  private createLocationQuery(): string {
    return `${this.apiEndpoint}/geo/1.0/direct?q=${this.currentCity}&limit=1&appid=${this.key}`;
  }

  private createForecastQuery(location: Location): string {
    return `${this.apiEndpoint}/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&units=imperial&appid=${this.key}`;
  }

  private async fetchAPI(query: string): Promise<any> {
    try {
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(`Error fetching API: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Fetch Error:', error);
      throw new Error('Unable to fetch data from the API.');
    }
  }

  private extractLocation(data: any[]): Location {
    if (!data || data.length === 0) {
      throw new Error('No location data found.');
    }

    const { name: city, lat: latitude, lon: longitude, country, state: region } = data[0];
    return { city, latitude, longitude, country, region };
  }

  private parseWeatherResponse(response: any): WeatherDetails[] {
    const forecast: WeatherDetails[] = [];
    const filteredData = response.list.filter((entry: any) =>
      entry.dt_txt.includes('12:00:00')
    );

    for (const item of filteredData) {
      forecast.push(
        new WeatherDetails(
          this.currentCity,
          dayjs.unix(item.dt).format('M/D/YYYY'),
          item.main.temp,
          item.wind.speed,
          item.main.humidity,
          item.weather[0].icon,
          item.weather[0].description || item.weather[0].main
        )
      );
    }

    return forecast;
  }

  private parseCurrentWeather(data: any): WeatherDetails {
    return new WeatherDetails(
      this.currentCity,
      dayjs.unix(data.dt).format('M/D/YYYY'),
      data.main.temp,
      data.wind.speed,
      data.main.humidity,
      data.weather[0].icon,
      data.weather[0].description || data.weather[0].main
    );
  }

  async getWeather(city: string): Promise<WeatherDetails[]> {
    try {
      this.validateConfig();
      this.currentCity = city;

      // Fetch location
      const locationData = await this.fetchAPI(this.createLocationQuery());
      const location = this.extractLocation(locationData);

      // Fetch weather
      const weatherData = await this.fetchAPI(this.createForecastQuery(location));
      const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
      const forecast = this.parseWeatherResponse(weatherData);

      return [currentWeather, ...forecast];
    } catch (error) {
      console.error('Weather Service Error:', error);
      throw new Error('Unable to retrieve weather data.');
    }
  }
}

export default new WeatherAPI();