export default {
    toTime(unix) {
        const date = new Date(unix * 1000)
        console.log("[CONVERT] Полученная дата", date)
        const hours = `${date.getHours()}`
        const minutes = `${date.getMinutes()}`
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
    },
    toVisibilityDesc(visible) {
        const v = visible;
        let res;
        if (v < 1000) {
            res = `${Math.round(v)} м`;
        } else {
            res = `${Math.round(v / 1000)} км`;
        }
        if (v > 0 && v < 500) { return `Очень плохая (${res})` }
        else if (v >= 500 && v < 1000) { return `Плохая (${res})` }
        else if (v >= 1000 && v < 2000) { return `Умеренная (${res})` }
        else if (v >= 2000 && v < 10000) { return `Средняя (${res})` }
        else if (v >= 10000 && v < 20000) { return `Хорошая (${res})` }
        else if (v >= 20000 && v < 50000) { return `Очень хорошая (${res})` }
        else if (v >= 50000) { return `Исключительная (${res})` }
        else { return `Неизвестно (${res})` }
    },
    toMillimetersOfMercury(pressure) {
        return Math.round(pressure * 0.7500637554192)

    },
    toWeatherIcon(weather_code) {
        const w = weather_code;
        if (w == 0) { return 'Sun.png' }
        else if (w == 1 || w == 2) { return 'CloudSun.svg' }
        else if (w == 3) { return 'Clouds.svg' }
        else if (w == 45 || w == 48) { return 'CloudFog2.svg' }
        else if (w == 51 || w == 53 || w == 55 || w == 56 || w == 57) { return 'CloudDrizzle.svg' }
        else if (w == 61 || w == 63 || w == 65 || w == 80 || w == 81 || w == 82) { return 'CloudRainHeavy.svg' }
        else if (w == 66 || w == 67) { return 'CloudSleet.svg' }
        else if (w == 71 || w == 73 || w == 75 || w == 85 || w == 86) { return 'CloudSnow.svg' }
        else if (w == 77 || w == 96 || w == 99) { return 'CloudHail.svg' }
        else if (w == 95) { return 'CloudLightningRain.svg' }
        
    },
    toWeatherDesc(weather_code, language) {
        const lang = language || 'Русский';
        const descriptions = language[lang]?.weatherDescriptions || language['Русский'].weatherDescriptions;
        return descriptions[weather_code] || 'Неизвестная погода';
    }
}