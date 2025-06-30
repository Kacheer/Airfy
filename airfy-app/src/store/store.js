import { defineStore } from "pinia";

export const useStore = defineStore ('store', {

  state: () => ({
    geo: {
      city: "",
      country: ""
    },
    today: {
      temp: "",
      sky: "",
      details: {
        temp_morning: "",
        temp_afternoon: "",
        temp_evening: "",
        temp_night: "",
        feels_like: "",
        pressure: "",
        sea_level: "",
        grnd_level: "",
        humidity: "",
        wind_speed: "",
        visibility: "",
        sunrise: "",
        sunset: ""
      }

    },
    nextDay_1: {
      temp: "",
      sky: "",
      details: {
        temp_morning: "",
        temp_afternoon: "",
        temp_evening: "",
        temp_night: "",
        feels_like: "",
        pressure: "",
        sea_level: "",
        grnd_level: "",
        humidity: "",
        wind_speed: "",
        visibility: "",
        sunrise: "",
        sunset: ""
      }

    },
    nextDay_2: {
      temp: "",
      sky: "",
      details: {
        temp_morning: "",
        temp_afternoon: "",
        temp_evening: "",
        temp_night: "",
        feels_like: "",
        pressure: "",
        sea_level: "",
        grnd_level: "",
        humidity: "",
        wind_speed: "",
        visibility: "",
        sunrise: "",
        sunset: ""
      }

    },
    nextDay_3: {
      temp: "",
      sky: "",
      details: {
        temp_morning: "",
        temp_afternoon: "",
        temp_evening: "",
        temp_night: "",
        feels_like: "",
        pressure: "",
        sea_level: "",
        grnd_level: "",
        humidity: "",
        wind_speed: "",
        visibility: "",
        sunrise: "",
        sunset: ""
      }

    },
    nextDay_4: {
      temp: "",
      sky: "",
      details: {
        temp_morning: "",
        temp_afternoon: "",
        temp_evening: "",
        temp_night: "",
        feels_like: "",
        pressure: "",
        sea_level: "",
        grnd_level: "",
        humidity: "",
        wind_speed: "",
        visibility: "",
        sunrise: "",
        sunset: ""
      }

    }

  }),

    actions: {
        setCurrentCity() {
            this.value++
        }
    },

  getters: {
    double() {
      return this.value * 2;
    }
  }
})