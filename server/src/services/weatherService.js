import axios from 'axios';

export const DISTRICT_COORDINATES = {
  Nashik: { lat: 19.9975, lon: 73.7898 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Ahmednagar: { lat: 19.0952, lon: 74.7496 },
  Solapur: { lat: 17.6599, lon: 75.9064 },
  Kolhapur: { lat: 16.7050, lon: 74.2433 },
  'Chhatrapati Sambhajinagar': { lat: 19.8762, lon: 75.3433 },
  Jalgaon: { lat: 21.0077, lon: 75.5626 },
  Nagpur: { lat: 21.1458, lon: 79.0882 },
};

export async function getForecast(lat = 19.9975, lon = 73.7898, district = 'Nashik') {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;
    const response = await axios.get(url, { timeout: 6000 });
    const data = response.data;

    const current = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const rainSum48h = (daily.precipitation_sum?.slice(0, 2) || []).reduce((a, b) => a + (b || 0), 0);

    const formattedDaily = (daily.time || []).slice(0, 7).map((t, idx) => {
      const d = new Date(t);
      return {
        day: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' }),
        date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        maxTemp: Math.round(daily.temperature_2m_max?.[idx] || 30),
        minTemp: Math.round(daily.temperature_2m_min?.[idx] || 20),
        rainMm: Number((daily.precipitation_sum?.[idx] || 0).toFixed(1)),
        rainProb: daily.precipitation_probability_max?.[idx] || 0,
        condition: (daily.precipitation_sum?.[idx] || 0) > 5 ? 'Rain Showers' : 'Clear / Fair',
      };
    });

    const formattedHourly = (hourly.time || []).slice(0, 24).map((t, idx) => ({
      time: new Date(t).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      temp: Math.round(hourly.temperature_2m?.[idx] || 25),
      rainProb: hourly.precipitation_probability?.[idx] || 0,
      rainMm: Number((hourly.precipitation?.[idx] || 0).toFixed(1)),
      humidity: hourly.relative_humidity_2m?.[idx] || 60,
    }));

    return {
      district,
      currentTemp: Math.round(current.temperature_2m || 28),
      apparentTemp: Math.round(current.apparent_temperature || 29),
      humidity: current.relative_humidity_2m || 65,
      windSpeed: Math.round(current.wind_speed_10m || 10),
      cloudCover: current.cloud_cover || 20,
      rainSum48h: Number(rainSum48h.toFixed(1)),
      conditionText: rainSum48h > 8 ? 'Rain Showers Expected' : 'Fair / Clear',
      hourly: formattedHourly,
      daily: formattedDaily,
      isLive: true,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('[Weather Service] Open-Meteo external call failed, serving fallback:', err.message);
    // Return sample fallback
    return {
      district,
      currentTemp: 28,
      apparentTemp: 29,
      humidity: 68,
      windSpeed: 10,
      cloudCover: 30,
      rainSum48h: 12.5,
      conditionText: 'Partly Cloudy (Sample Data)',
      isLive: false,
      timestamp: new Date().toISOString(),
      hourly: Array.from({ length: 24 }).map((_, i) => ({
        time: `${String(i).padStart(2, '0')}:00`,
        temp: Math.round(22 + 8 * Math.sin((i / 24) * Math.PI)),
        rainProb: i >= 14 && i <= 20 ? 40 : 10,
        rainMm: i >= 16 && i <= 18 ? 2.0 : 0,
        humidity: Math.round(75 - 20 * Math.sin((i / 24) * Math.PI)),
      })),
      daily: [
        { day: 'Today', date: '25 Oct', maxTemp: 31, minTemp: 20, rainMm: 4.5, rainProb: 40, condition: 'Scattered Showers' },
        { day: 'Tomorrow', date: '26 Oct', maxTemp: 30, minTemp: 19, rainMm: 8.0, rainProb: 60, condition: 'Moderate Rain' },
        { day: 'Day 3', date: '27 Oct', maxTemp: 29, minTemp: 19, rainMm: 1.0, rainProb: 20, condition: 'Clearing Skies' },
        { day: 'Day 4', date: '28 Oct', maxTemp: 31, minTemp: 21, rainMm: 0.0, rainProb: 5, condition: 'Sunny / Dry' },
        { day: 'Day 5', date: '29 Oct', maxTemp: 32, minTemp: 22, rainMm: 0.0, rainProb: 5, condition: 'Sunny / Warm' },
        { day: 'Day 6', date: '30 Oct', maxTemp: 32, minTemp: 22, rainMm: 0.0, rainProb: 5, condition: 'Clear Skies' },
        { day: 'Day 7', date: '31 Oct', maxTemp: 33, minTemp: 23, rainMm: 0.0, rainProb: 10, condition: 'Sunny' },
      ],
    };
  }
}
