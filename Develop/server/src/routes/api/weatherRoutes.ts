import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';



// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
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
router.get('/history', async (_req: Request, res: Response) => {
  HistoryService.getCities()
  .then((data) => {
    return res.json(data);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ error: 'City ID is required' });
      return;
    }

    await HistoryService.removeCity(req.params.id);
    res.json({ success: 'Removed city from search history' });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
