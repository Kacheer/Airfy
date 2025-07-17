
import axios from 'axios'

const BASE_URL = "https://api.open-meteo.com/";

export default {

  async fetchForecast() {

    const api = axios.create({
      baseURL: BASE_URL,
      timeout: 5000
    })

    api.get('v1/forecast',
      {
        params: {
          latitude: 0,
          longitude: 0,
          hourly: 'visibility,apparent_temperature,wind_speed_10m,temperature_2m,relative_humidity_2m,precipitation,wind_gusts_10m,cloud_cover,surface_pressure,pressure_msl,uv_index',
          current: 'temperature_2m,apparent_temperature,rain,snowfall,showers,precipitation,wind_speed_10m,surface_pressure,pressure_msl,relative_humidity_2m',
          timeformat: 'unixtime',
        }
      }
    )
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      if (error.code === 'ECONNABORTED') {
        console.error('Запрос превысил время ожидания ответа')
      }
      else if (error.code === '401') {
        console.error('[API] 401 Unauthorized')
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

