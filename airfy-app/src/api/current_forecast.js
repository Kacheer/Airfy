
import axios from 'axios'

export default {

  async fetchForecast(city) {
    
    const api = axios.create({
      baseURL: 'http://api.openweathermap.org/',
      timeout: 5000
    })

    const lang = "ru"
    const units = "metric"
    const key = "6fdcdee5063bbdb836d094f2762d3f8f"
    
    api.get('/data/2.5/forecast', {
      params: {
        q: city,
        appid: key,
        lang: lang,
        units: units
      }
    })
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

}

