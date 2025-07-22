
import axios from 'axios'
import DataService from '../services/DataService';
const BASE_URL = "https://api.open-meteo.com/";
var userPos = {
  lat: null,
  long: null
}
export default {

  async fetchForecast() {

    const api = axios.create({
      baseURL: BASE_URL,
      timeout: 5000
    })
    
     userPos = DataService.getPosStore()
    console.log("[API] userPos получен", userPos.lat, userPos.long)

    api.get('v1/forecast',
      {
        params: {
          latitude: userPos.lat,
          longitude: userPos.long,
          daily: 'sunrise,sunset,weather_code,temperature_2m_mean,precipitation_probability_mean,relative_humidity_2m_mean,visibility_mean,winddirection_10m_dominant,wind_gusts_10m_mean,cloud_cover_mean,surface_pressure_max,surface_pressure_min',
          hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,precipitation_probability,wind_speed_10m,pressure_msl,surface_pressure,visibility,uv_index',
          current: 'temperature_2m,weather_code',
          timeformat: 'unixtime',
        }
      }
      //https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=sunrise,sunset,weather_code,temperature_2m_mean,precipitation_probability_mean,relative_humidity_2m_mean,visibility_mean,winddirection_10m_dominant,wind_gusts_10m_mean,cloud_cover_mean,surface_pressure_max,surface_pressure_min&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,precipitation_probability,wind_speed_10m,pressure_msl,surface_pressure,visibility,uv_index&current=temperature_2m,weather_code&timeformat=unixtime
    )
    .then(response => {
      console.log("[API] Данные получены", response.data);
      DataService.addResponseToStore(response)
      console.log("---- ПОЛУЧИЛОСЬ ? ---- \n", serverStore.getDailyForecast())
      
    })
    .catch(error => {
      if (error.code === 'ECONNABORTED') {
        console.error('Запрос превысил время ожидания ответа')
      }
      else if (error.code === '401') {
        console.error('[API] 401 Unauthorized')
      }
      else {
        console.error('[API] Не предвиденная ошибка ', error.code)
      }
    })
  }

  // async fetchForecast(city) {
    
  //   const api = axios.create({
  //     baseURL: 'http://api.openweathermap.org/',
  //     timeout: 5000
  //   })

  //   const lang = "ru"
  //   const units = "metric"
  //   const key = "6fdcdee5063bbdb836d094f2762d3f8f"

  //   api.get('/data/2.5/forecast', {
  //     params: {
  //       q: city,
  //       appid: key,
  //       lang: lang,
  //       units: units
  //     }
  //   })
  //   .then(response => {
  //     console.log(response.data);
  //   })
  //   .catch(error => {
  //     if (error.code === 'ECONNABORTED') {
  //       console.error('Запрос превысил время ожидания ответа')
  //     }
  //     else if (error.code === '401') {
  //       console.error('[API] 401 Unauthorized')
  //     }
  //   })
  // }

}

