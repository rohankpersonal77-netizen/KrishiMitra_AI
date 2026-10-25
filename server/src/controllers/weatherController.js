import { getForecast, DISTRICT_COORDINATES } from '../services/weatherService.js';

export async function getWeatherForecast(req, res) {
  try {
    const district = req.query.district || 'Nashik';
    const coords = DISTRICT_COORDINATES[district] || DISTRICT_COORDINATES.Nashik;
    const lat = req.query.lat || coords.lat;
    const lon = req.query.lon || coords.lon;

    const forecast = await getForecast(lat, lon, district);
    res.json(forecast);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve weather forecast', error: err.message });
  }
}
