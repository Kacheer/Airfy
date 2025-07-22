import { defineStore } from "pinia";

export const useServerStore = defineStore('ServerStore', {


  state: () => ({
    units: {
      temperature: null,
      pressure: null,
      wind_speed: null,
    },
    current: {
      temperature: null,
      weather_desc: null
    },
    daily: [
    ]
  }),

  actions: {
    setCurrent(temperature, weather_desc) {
      this.temperature = temperature,
        this.weather_desc = weather_desc
    },
    setUnits(temperature, pressure, wind_speed) {
      this.temperature = temperature,
        this.pressure = pressure,
        this.wind_speed = wind_speed
    },
    addDailyForecast(daily) {
      this.daily.push({
        temperature: daily.temperature,
        weather_code: daily.weather_code,
        precipitation_probability: daily.precipitation_probability,
        pressure_max: daily.pressure_max,
        pressure_min: daily.pressure_min,
        humidity: daily.humidity,
        visibility: daily.visibility,
        wind_speed: daily.wind_speed,
        sunrise: daily.sunrise,
        sunset: daily.sunset,
        hourly: []
      })
    },
    addHourly(daily_id, hourly) {
      this.daily[daily_id].hourly.push({
        temperature: hourly.temperature,
        apparent_temperature: hourly.apparent_temperature,
        precipitation_probability: hourly.apparent_temperature,
        precipitation: hourly.precipitation,
        visibility: hourly.visibility
      })
    },
    getDailyForecast() {
      return this.daily
    }

  },

  getters: {

  }
})