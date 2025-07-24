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
    daily: []
  }),

  actions: {
    setCurrent(temperature, weather_desc) {
      this.current.temperature = temperature;
      this.current.weather_desc = weather_desc;
    },
    setUnits(temperature, pressure, wind_speed) {
      this.units.temperature = temperature;
      this.units.pressure = pressure;
      this.units.wind_speed = wind_speed;
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
      });
    },
    setDailyForecast(dailyData) {
      try {
        this.daily = dailyData.map(daily => ({
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
          hourly: daily.hourly || []
        }));
        console.log("[STORE] Данные daily обновлены:", this.daily);
        return true;
      } catch (error) {
        console.error("[STORE] Ошибка в setDailyForecast:", error);
        return false;
      }
    },
    getDailyForecast() {
      return this.daily;
    },
    addHourlyForecast(daily_id, hourly) {
      this.daily[daily_id].hourly.push({
        temperature: hourly.temperature,
        apparent_temperature: hourly.apparent_temperature,
        precipitation_probability: hourly.precipitation_probability,
        precipitation: hourly.precipitation,
        visibility: hourly.visibility
      });
    },
    setHourlyForecast(daily_id, hourly) {
      const data = this.daily[daily_id].hourly;
      console.log("[STORE] setHourlyForecast Data", data);
      for (let i = 0; i < data.length; i++) {
        data[i].temperature = hourly.temperature;
        data[i].apparent_temperature = hourly.apparent_temperature;
        data[i].precipitation_probability = hourly.precipitation_probability;
        data[i].precipitation = hourly.precipitation;
        data[i].visibility = hourly.visibility;
      }
    },
    checkDailyData() {
      console.log("Данные есть!");
      console.log(this.daily);
    }
  },

  getters: {},
  persist: true
});