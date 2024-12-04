// TODO: Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) {}
}
// TODO: Complete the HistoryService class
class HistoryService {
  private async read(): Promise<City[]> {
    try {

      const data = await FileSystem.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []; 
      }
      throw error;
    }
  }

  private async write(cities: City[]): Promise<void> {
    const data = JSON.stringify(cities, null, 2);
    await FileSystem.writeFile(filePath, data, 'utf-8');
  }

  async getCities(): Promise<City[]> {
    return await this.read();
  }

  async addCity(name: string): Promise<void> {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const newCity = new City(id, name);

    const cities = await this.read();
    cities.push(newCity);
    await this.write(cities);
  }

  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter((city) => city.id !== id);

    await this.write (updatedCities);
  }
}
export default new HistoryService();
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}


