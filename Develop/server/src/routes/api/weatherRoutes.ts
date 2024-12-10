import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { cityName } = req.body;
  
  if (!cityName) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    // Fetch weather data using the WeatherService
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // Save city to search history using HistoryService
    const historyEntry = await HistoryService.addCity(cityName);

    // Return weather data along with history entry (or just weather data if desired)
    return res.status(200).json([weatherData, historyEntry]);
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    return res.status(500).json({ message: 'Error retrieving weather data' });
  }
});

// GET search history
router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getSearchHistory();
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ message: 'Error fetching search history' });
  }
});

// DELETE city from search history
 router.delete('/history/:id', async (req, res) => {
   const { id } = req.params;

  try {
     const result = await HistoryService.removeCity(id);
     if (result) {
      res.status(200).json({ message: 'City removed from history' });
    } else {
       res.status(404).json({ message: 'City not found in history' });
     }
   } catch (error) {
     console.error('Error deleting city from history:', error);
    res.status(500).json({ message: 'Error deleting city from history' });
   }
 });

export default router;