import pinia from '../store/index'; 
import { useUserStore } from "../store/userStore"
import { useServerStore } from "../store/Serverstore"
var store = useUserStore(pinia);
var serverStore = useServerStore(pinia)
export default {
    addPosToStore(lat, long) {
        if (store.userPos.lat == null || store.userPos.long == null) {
            const res = store.setUserPos(lat, long)
            console.log("[DS] Координаты занесены", res)
        }
        else {
            console.log("[DS] Координаты уже были записаны")
        }
    },
    addResponseToStore(response) {
        const data = response.data
        console.log("[DS] Данные приняты !", data)
        serverStore.daily = []
        for (let i = 0; i <= 6; i++) {
           const dailyModel = {
            temperature: data.daily.temperature_2m_mean[i],
            weather_code: data.daily.weather_code[i],
            precipitation_probability: data.daily.precipitation_probability_mean[i],
            pressure_max: data.daily.surface_pressure_max[i],
            pressure_min: data.daily.surface_pressure_min[i],
            humidity: data.daily.relative_humidity_2m_mean[i],
            visibility: data.daily.visibility_mean[i],
            wind_speed: data.daily.wind_gusts_10m_mean[i],
            sunrise: data.daily.sunrise[i],
            sunset: data.daily.sunset[i],
            hourly: []
        };
            serverStore.addDailyForecast(dailyModel);
            console.log("[DS] Модель ежедневных данных отправлена в хранилище !", dailyModel)
        }

        for (let day = 0; day < 7; day++) {
            serverStore.daily[day].hourly = [];

            for(let hour = 0; hour < 24; hour ++) {
                const i = day * 24 + hour;
                const hourlyModel = {
                temperature: data.hourly.temperature_2m[i],
                apparent_temperature: data.hourly.apparent_temperature[i],
                humidity: data.hourly.relative_humidity_2m[i],
                precipitation_probability: data.hourly.precipitation_probability[i],
                precipitation: data.hourly.precipitation[i],
                visibility: data.hourly.visibility[i]
                }
            serverStore.addHourlyForecast(day, hourlyModel);
            console.log("[DS] Модель почасовых данных отправлена в хранилище !", dailyModel)
            }
        }
        console.log("---- ПОЛУЧИЛОСЬ ? ---- \n", serverStore.getDailyForecast())
    },
    getPosStore() {
        return store.getUserPos()
    },
    ResponseTime() {
        const requestTime = store.getRequestTime()
        if (requestTime == null) {
            store.setRequestTime()
        }
        else {
            return requestTime
        }
    },
        waitForCoordinates() {
        return new Promise((resolve) => {
            const check = () => {
                if (store.userPos.lat !== null && store.userPos.long !== null) {
                    resolve(true)
                } else {
                    setTimeout(check, 100)
                }
            }
            check()
        })
    }
}
var hourlyModel = {
    temperature: null,
    apparent_temperature: null,
    humidity: null,
    precipitation_probability: null,
    precipitation: null,
    visibility: null
}
var dailyModel = {
    temperature: null,
    weather_code: null,
    precipitation_probability: null,
    pressure_max: null,
    pressure_min: null,
    humidity: null,
    visibility: null,
    wind_speed: null,
    sunrise: null,
    sunset: null,
    hourly: [
    ]
}

// function formatUnixTimestamp(timestamp) {
//     const date = new Date(timestamp * 1000); // Умножаем на 1000 для перевода секунд в миллисекунды

//     const day = String(date.getDate()).padStart(2, '0'); // День с ведущим нулём
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы 0-11 → добавляем 1
//     const year = date.getFullYear(); // Год

//     return `${day}/${month}/${year}`;
// }