import axios from 'axios';
import DataService from '../services/DataService';
import { useServerStore } from "../store/Serverstore"; // Import ServerStore instead of userStore
import pinia from '../store/index';

const BASE_URL = "https://api.open-meteo.com/";

const serverStore = useServerStore(pinia);

export default {
  async fetchForecast(force = false) {
    await DataService.waitForCoordinates();
    const pos = DataService.getPosStore();
    console.log("[API] Позиция пользователя получена:", pos.lat, pos.long);

    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000; 

    if (!force && serverStore.lastFetched && (now - serverStore.lastFetched < tenMinutes)) {
      console.log("[API] Данные свежие (< 10 минут), загружаем из localStorage");
      if (serverStore.loadState()) {
        console.log("[API] Данные успешно загружены из localStorage");
        return;
      }
    }

    console.log("[API] Обновляем данные с сервера");

    const api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000
    });

    try {
      const response = await api.get('v1/forecast', {
        params: {
          latitude: pos.lat,
          longitude: pos.long,
          daily: 'sunrise,sunset,weather_code,temperature_2m_mean,precipitation_probability_mean,relative_humidity_2m_mean,visibility_mean,winddirection_10m_dominant,wind_gusts_10m_mean,cloud_cover_mean,surface_pressure_max,surface_pressure_min',
          hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,precipitation_probability,wind_speed_10m,pressure_msl,surface_pressure,visibility,uv_index,weather_code',
          current: 'temperature_2m,weather_code',
          timezone: 'auto',
          timeformat: 'unixtime',
          wind_speed_unit: 'ms'
        }
      });

      console.log("[API] Данные успешно получены:", response.data);
      DataService.addResponseToStore(response);
      serverStore.lastFetched = now;
      serverStore.saveState();
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('[API] Превышено время ожидания ответа');
      } else if (error.code === '401') {
        console.error('[API] 401 Unauthorized');
      } else {
        console.error('[API] Неизвестная ошибка:', error.message);
      }
      throw error;
    }
  }
};