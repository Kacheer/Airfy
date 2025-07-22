import pinia from '../store/index'; 
import { useUserStore } from "../store/userStore"
import { useServerStore } from "../store/Serverstore"
var store = useUserStore(pinia);
var serverStore = useServerStore(pinia)
export default {
    addPosToStore(lat, long) {
        const res = store.setUserPos(lat, long)
        console.log("[DS] данные занесены", res)
    },
    addResponseToStore(response) {
        serverStore.$reset() // УБЕРИ ЭТО КАК ТОЛЬКО СДЕЛАЕШЬ СИСТЕМУ ПРОВЕРКИ НАЛИЧИЯ РАНЕЕ ЗАПИСАННЫХ ДАННЫХ
        const data = response.data
        console.log("[DS] Данные приняты !", data)
        for (let i = 0; i <= 6; i++) {
            dailyModel.temperature = data.daily.temperature_2m_mean[i]
            console.log("[DS] Тест", data.daily.temperature_2m_mean[i])
            dailyModel.weather_code = data.daily.weather_code[i]
            dailyModel.precipitation_probability = data.daily.precipitation_probability_mean[i]
            dailyModel.pressure_max = data.daily.surface_pressure_max[i]
            dailyModel.pressure_min = data.daily.surface_pressure_min[i]
            dailyModel.humidity = data.daily.relative_humidity_2m_mean[i]
            dailyModel.visibility = data.daily.visibility_mean[i]
            dailyModel.wind_speed = data.daily.wind_gusts_10m_mean[i]
            dailyModel.sunrise = data.daily.sunrise[i]
            dailyModel.sunset = data.daily.sunset[i]
            console.log("[DS] Модель данных собрана !", dailyModel)
            serverStore.addDailyForecast(dailyModel)
            console.log("[DS] Модель данных отправлена в хранилище !", dailyModel)
        }
        let j = 0;
        for (let i = 1; i <= 168; i++) {
            hourlyModel.temperature = data.hourly.temperature_2m[i-1]
            hourlyModel.apparent_temperature = data.hourly.apparent_temperature[i-1]      
            hourlyModel.humidity = data.hourly.relative_humidity_2m[i-1]
            hourlyModel.precipitation_probability = data.hourly.precipitation_probability[i-1]
            hourlyModel.precipitation = data.hourly.precipitation[i-1]
            hourlyModel.visibility = data.hourly.visibility[i-1]
            if (i % 24 != 0) { // ! 24, ! 48. ! 72, ! 96, ! 120, ! 144, ! 168  
                serverStore.addHourly(j,hourlyModel)
            }
            else {
                serverStore.addHourly(j,hourlyModel)
                j++
            }
        }
        console.log("---- ПОЛУЧИЛОСЬ ? ---- \n", serverStore.getDailyForecast())
    },
    getPosStore() {
        return store.getUserPos()
    },
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