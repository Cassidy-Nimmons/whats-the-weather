import fs from 'fs';
import path from 'path';

// Define the City interface
class City {
  constructor(public id:string, public name: string) {}
}

class HistoryService {
  private historyFilePath = path.resolve('data', 'searchHistory.json'); // Path to the searchHistory.json file

  // Read the data from searchHistory.json
  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(this.historyFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading the search history file:', err);
      return []; // Return an empty array if the file does not exist or there is an error
    }
  }

  // Write updated cities to searchHistory.json
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.promises.writeFile(this.historyFilePath, JSON.stringify(cities, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to the search history file:', err);
    }
  }

  // Get the search history (list of cities)
  async getSearchHistory(): Promise<City[]> {
    return this.read();
  }

  // Add a new city to the search history
  async addCity(city: string): Promise<void> {
    const cities = await this.read();
    const newCity: City = { id: this.generateUniqueId(), name: city };
    cities.push(newCity);
    await this.write(cities);
  }

  // Remove a city from the search history
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }

  // Generate a unique ID for each city (this can be a simple string or UUID)
  private generateUniqueId(): string {
    return Date.now().toString(); // A simple unique ID based on timestamp
  }
}

export default new HistoryService();