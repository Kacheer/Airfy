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
    const data = response.data;
    console.log("[DS] Данные приняты !", data);
    serverStore.setCurrent(data.current.temperature_2m, data.current.weather_code);
    serverStore.setUnits(data.daily_units.temperature_2m_mean, data.daily_units.surface_pressure_max, data.daily_units.wind_gusts_10m_mean);
    const dailyData = [];
    try {
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
            dailyData.push(dailyModel);
            console.log("[DS] Модель ежедневных данных собрана !", dailyModel);
        }
        serverStore.setDailyForecast(dailyData);
        console.log("[DS] Ежедневные данные отправлены в хранилище !", serverStore.getDailyForecast());
    } catch (error) {
        console.error("[DS] Ошибка при сборке ежедневных данных:", error);
        return;
    }
    try {
        for (let day = 0; day < 7; day++) {
            for (let hour = 0; hour < 24; hour++) {
                const i = day * 24 + hour;
                const hourlyModel = {
                    time: data.hourly.time[i],
                    weather_code: data.hourly.weather_code[i],
                    temperature: data.hourly.temperature_2m[i],
                    apparent_temperature: data.hourly.apparent_temperature[i],
                    humidity: data.hourly.relative_humidity_2m[i],
                    precipitation_probability: data.hourly.precipitation_probability[i],
                    precipitation: data.hourly.precipitation[i],
                    visibility: data.hourly.visibility[i],
                };
                serverStore.addHourlyForecast(day, hourlyModel);
                console.log("[DS] Модель почасовых данных отправлена в хранилище !", hourlyModel);
            }
        }
    } catch (error) {
        console.error("[DS] Ошибка при добавлении почасовых данных:", error);
        return;
    }
    console.log("---- ПОЛУЧИЛОСЬ ? ---- \n", serverStore.getDailyForecast());
},
    // Исключительно для тестирования
    printForecastData() {
        console.log("----- ДАННЫЕ ИЗ ХРАНИЛИЩА -----",localStorage.getItem("pinia:ServerStore"))
    },
    getPosStore() {
        return store.getUserPos()
    },
    getAllData() {
        const data = serverStore.getAll()
        console.log("[DS] Все данные получены!", data)
        return {
            units: data.units,
            current: data.current,
            daily: data.daily
        }
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