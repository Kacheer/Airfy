
import axios from 'axios'

export default {
    async fetchForecast(city) {
    const lang = "ru"
      const units = "metric"
      const key = "6fdcdee5063bbdb836d094f2762d3f8f"

      const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&lang=${lang}&units=${units}`
      try {
        const response = await axios.get(url)
        console.log('data:', response.data)
        if(response.status >= 200 && response.status < 300) {
          console.log(response.data);
        }else {
          throw new Error(`Статус: ${response.status}`)
        }
      }catch (err) {
        if(err.response) {
          console.error(`${err.response.status}:`, err.response.data)
        }else {
          console.error('Ошибка при выполнении запроса:', err.message)
        }
        throw err
      }
    }

}

