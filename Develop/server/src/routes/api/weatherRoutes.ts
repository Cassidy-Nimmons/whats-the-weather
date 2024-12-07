import { Router, type Request, type Response } from 'express';
import historyService from '../../service/historyService';
import weatherService from '../../service/weatherService';

const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  try {
    const cityName = req.body.cityName;
    weatherService.getWeatherForCity(cityName).then((data) => {
      historyService.addCity(cityName);
      res.json(data);
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await historyService.getSearchHistory();
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ message: 'Error fetching search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ error: 'City ID is required' });
      return;
    }
    await historyService.removeCity(req.params.id);
    res.json({ success: 'Removed city from search history' });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
