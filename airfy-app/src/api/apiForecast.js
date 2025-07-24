import axios from 'axios';
import DataService from '../services/DataService';
import { useUserStore } from "../store/userStore";
import pinia from '../store/index';

const BASE_URL = "https://api.open-meteo.com/";


const userStore = useUserStore(pinia);

export default {
  async fetchForecast() {
    await DataService.waitForCoordinates();
    const pos = DataService.getPosStore();
    console.log("[API] userPos получен", pos.lat, pos.long);
    if (userStore.requestTime == null) {
      userStore.setRequestTime()
      console.log("Я НАЕБАЛ САМ СЕБЯ ? ")
    }
    const currentTime = new Date().getTime();
    const lastRequestTime = userStore.getRequestTime();
    console.log("ВРЕМЯ ЗАСЕЙВИЛОСЬ БЛЯТЬ ? ",lastRequestTime)
    const oneHour = 3600 * 1000;

    if (!lastRequestTime || (currentTime - lastRequestTime > oneHour)) {
      //Работает супер магическим образом ✨
      console.log("[API] Обновление данных, так как прошло более часа или это первый запрос");

      const api = axios.create({
        baseURL: BASE_URL,
        timeout: 5000
      });

      try {
        const response = await api.get('v1/forecast', {
          params: {
            latitude: pos.lat,
            longitude: pos.long,
            daily: 'sunrise,sunset,weather_code,temperature_2m_mean,precipitation_probability_mean,relative_humidity_2m_mean,visibility_mean,winddirection_10m_dominant,wind_gusts_10m_mean,cloud_cover_mean,surface_pressure_max,surface_pressure_min',
            hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,precipitation_probability,wind_speed_10m,pressure_msl,surface_pressure,visibility,uv_index',
            current: 'temperature_2m,weather_code',
            timeformat: 'unixtime',
          }
        });
        
        console.log("[API] Данные получены", response.data);
        DataService.addResponseToStore(response);
        userStore.setRequestTime();
      } catch (error) {
        if (error.code === 'ECONNABORTED') {
          console.error('Запрос превысил время ожидания ответа');
        } else if (error.code === '401') {
          console.error('[API] 401 Unauthorized');
        } else {
          console.error('[API] Не предвиденная ошибка ', error.code);
        }
      }
    } else {
      console.log("[API] Используем существующие данные, так как прошло менее часа");
    }
  DataService.printForecastData()
  }
};