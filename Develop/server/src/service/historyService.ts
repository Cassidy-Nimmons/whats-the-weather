import fs from 'fs';
import path from 'path';

// Define the City interface
class City {
  constructor(public name: string, public id: string) {}
}

class HistoryService {
  private dbPath = 'db/db.json';

  // Read cities from the database file
  private async read(): Promise<string> {
    try {
      const data = await fs.readFile(this.dbPath, { encoding: 'utf8', flag: 'a+' });
      return data || '[]'; // Return an empty array if the file is empty
    } catch (error) {
      console.error('Error reading database file:', error);
      throw new Error('Failed to read database file');
    }
  }

  // Write cities to the database file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing to database file:', error);
      throw new Error('Failed to write to database file');
    }
  }

  // Get the list of cities
  async getCities(): Promise<City[]> {
    try {
      const data = await this.read();
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing cities:', error);
      return [];
    }
  }

  // Add a new city
  async addCity(cityName: string): Promise<City> {
    if (!cityName) {
      throw new Error('City name cannot be blank');
    }

    const newCity = new City(cityName, uuidv4());
    try {
      const cities = await this.getCities();

      // Avoid adding duplicate city names
      if (cities.some((city) => city.name.toLowerCase() === cityName.toLowerCase())) {
        throw new Error('City already exists in history');
      }

      const updatedCities = [...cities, newCity];
      await this.write(updatedCities);
      return newCity;
    } catch (error) {
      console.error('Error adding city:', error);
      throw new Error('Failed to add city');
    }
  }

  // Remove a city by ID
  async removeCity(cityId: string): Promise<void> {
    if (!cityId) {
      throw new Error('City ID is required');
    }

    try {
      const cities = await this.getCities();
      const updatedCities = cities.filter((city) => city.id !== cityId);
      await this.write(updatedCities);
    } catch (error) {
      console.error('Error removing city:', error);
      throw new Error('Failed to remove city');
    }
  }
}

export default new HistoryService();