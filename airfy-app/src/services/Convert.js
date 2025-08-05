import language from '../lang/language.js'

export default {
    toTime(unix) {
        const date = new Date(unix * 1000)
        console.log("[CONVERT] Полученная дата", date)
        const hours = `${date.getHours()}`
        const minutes = `${date.getMinutes()}`
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
    },
    toDayOfWeek(unix, lang) {
        const date = new Date(unix * 1000);
        const daysOfWeek = {
            'Русский': ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
            'English': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        };
        const selectedLang = lang || 'Русский';
        const dayIndex = date.getDay();
        return daysOfWeek[selectedLang][dayIndex];
    },
    toVisibilityDesc(visible, lang) {
        console.log("toVisibilityDesc: lang =", lang, "visible =", visible);
        const languageData = language || {};
        const selectedLang = lang || 'Русский';
        const descriptions = languageData[selectedLang]?.visibilityDescriptions || languageData['Русский'].visibilityDescriptions;
        console.log("toVisibilityDesc: descriptions =", descriptions);
        
        const v = visible;
        let res;
        if (v < 1000) {
            res = `${Math.round(v)} м`;
        } else {
            res = `${Math.round(v / 1000)} км`;
        }
        
        if (v > 0 && v < 500) {
            return `${descriptions.very_poor} (${res})`;
        } else if (v >= 500 && v < 1000) {
            return `${descriptions.poor} (${res})`;
        } else if (v >= 1000 && v < 2000) {
            return `${descriptions.moderate} (${res})`;
        } else if (v >= 2000 && v < 10000) {
            return `${descriptions.average} (${res})`;
        } else if (v >= 10000 && v < 20000) {
            return `${descriptions.good} (${res})`;
        } else if (v >= 20000 && v < 50000) {
            return `${descriptions.very_good} (${res})`;
        } else if (v >= 50000) {
            return `${descriptions.exceptional} (${res})`;
        } else {
            return `${descriptions.unknown} (${res})`;
        }
    },
    toMillimetersOfMercury(pressure) {
        return Math.round(pressure * 0.7500637554192)
    },
    toWeatherIcon(weather_code) {
        const w = weather_code;
        let icon;
        if (w == 0) { icon = 'Sun.svg' }
        else if (w == 1 || w == 2) { icon = 'CloudSun.svg' }
        else if (w == 3) { icon = 'Clouds.svg' }
        else if (w == 45 || w == 48) { icon = 'CloudFog2.svg' }
        else if (w == 51 || w == 53 || w == 55 || w == 56 || w == 57 || w == 61) { icon = 'CloudDrizzle.svg' }
        else if (w == 63 || w == 65 || w == 80 || w == 81 || w == 82) { icon = 'CloudRainHeavy.svg' }
        else if (w == 66 || w == 67) { icon = 'CloudSleet.svg' }
        else if (w == 71 || w == 73 || w == 75 || w == 85 || w == 86) { icon = 'CloudSnow.svg' }
        else if (w == 77 || w == 96 || w == 99) { icon = 'CloudHail.svg' }
        else if (w == 95) { icon = 'CloudLightningRain.svg' }
        console.log(`[CONVERT] Weather code ${w} mapped to ${icon}`);
        return icon;
    },
    toWeatherDesc(weather_code, lang) {
        console.log("toWeatherDesc: imported language =", language);
        console.log("toWeatherDesc: lang =", lang, "weather_code =", weather_code);
        const languageData = language || {};
        const selectedLang = lang || 'Русский';
        console.log("toWeatherDesc: selectedLang =", selectedLang);
        const descriptions = languageData[selectedLang]?.weatherDescriptions || languageData['Русский'].weatherDescriptions;
        console.log("toWeatherDesc: descriptions =", descriptions);
        return descriptions[weather_code] || 'Описание не найдено';
    }
}