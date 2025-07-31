<script>
import CurrentForecast from './components/CurrentForecast.vue';
import Header from './components/Header.vue';
import CurrentForecastDetails from './components/CurrentForecastDetails.vue';
import apiBrowser from './browser_api/apiBrowser';
import apiForecast from './api/apiForecast';
import DailyCard from './components/DailyCard.vue';
import language from './lang/language';
import HourlyCard from './components/HourlyCard.vue';
import DataService from './services/DataService';
import apiLocation from './api/apiLocation';
import Convert from './services/Convert.js';
import { useServerStore } from './store/Serverstore';

export default {
  components: {
    CurrentForecast,
    Header,
    CurrentForecastDetails,
    DailyCard,
    HourlyCard,
  },
  data() {
    return {
      currentCity: 'London',
      cities: ['Paris', 'New York', 'Tokyo', 'Moscow', 'Berlin'],
      selectedLanguage: 'Русский',
      temperature: 23,
      now: 'Now',
      dailyCards: [
        {
          title: 'Tomorrow',
          temperature: 23,
          feelsLike: 19,
          weatherCode: 1,
        },
        {
          title: 'Tuesday',
          temperature: 25,
          feelsLike: 20,
          weatherCode: 2,
        },
        {
          title: 'Wednesday',
          temperature: 25,
          feelsLike: 20,
          weatherCode: 2,
        },
        {
          title: 'Thursday',
          temperature: 25,
          feelsLike: 20,
          weatherCode: 2,
        },
        {
          title: 'Friday',
          temperature: 25,
          feelsLike: 20,
          weatherCode: 2,
        },
        {
          title: 'Saturday',
          temperature: 25,
          feelsLike: 20,
          weatherCode: 2,
        },
      ],
      units: null,
      current: {
        temperature: null,
        weather_code: null,
      },
      daily: [],
      isDataLoaded: false,
    };
  },
  created() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.selectedTheme = savedTheme;
      this.applyTheme(savedTheme);
    }
  },
  async mounted() {
    const serverStore = useServerStore();
    console.log("[APP] Начало получения позиции");

    // лоудим кеш из хранилища
    if (serverStore.loadState()) {
      const data = DataService.getAllData();
      this.units = data.units;
      this.current = data.current;
      this.daily = data.daily;
      this.isDataLoaded = true;
      console.log("[APP] Данные загружены из localStorage:", data);
    }

    try {
      const userPos = await apiBrowser.getPos();
      DataService.addPosToStore(userPos.lat, userPos.long);
      console.log("[APP] Координаты получены и сохранены");
      this.currentCity = await apiLocation.getCityNameByStore();
      console.log("[APP] Город определен:", this.currentCity);
      await apiForecast.fetchForecast();
      const data = DataService.getAllData();
      this.units = data.units;
      this.current = data.current;
      this.daily = data.daily;
      this.isDataLoaded = true;
      console.log("[APP] Данные отрисованы:", { units: this.units, current: this.current, daily: this.daily });
    } catch (error) {
      console.error("[APP] Ошибка при получении данных:", error);
      this.currentCity = 'Moscow';
      await apiForecast.fetchForecast(true);
      const data = DataService.getAllData();
      this.units = data.units;
      this.current = data.current;
      this.daily = data.daily;
      this.isDataLoaded = true;
    }

    // Автоматическое обновление каждые 10 минут
    setInterval(async () => {
      console.log("[APP] Запуск автоматического обновления данных");
      try {
        await apiForecast.fetchForecast(true);
        const data = DataService.getAllData();
        this.units = data.units;
        this.current = data.current;
        this.daily = data.daily;
        console.log("[APP] Данные обновлены автоматически");
      } catch (error) {
        console.error("[APP] Ошибка при автоматическом обновлении:", error);
      }
    }, 10 * 60 * 1000); // 10 минуток тут ) 
  },
  methods: {
    increment(index) {
      this.currentCity = this.cities[index];
      this.setStore();
    },
    setStore() {
		// это я спиздил, каюсь
      const userStore = require('./store/userStore').useUserStore(require('./store/index'));
      userStore.setUserPos(null, null);
      apiForecast.fetchForecast(true);
    },
    updateLanguage(newLang) {
      console.log("[APP] Updated language:", newLang);
      this.selectedLanguage = newLang;
    },
    round(number) {
      return Math.round(number);
    },
    updateTheme(newTheme) {
      this.selectedTheme = newTheme;
      localStorage.setItem('theme', newTheme);
      this.applyTheme(newTheme);
    },
    applyTheme(theme) {
      document.body.classList.remove('dark-mode');
      if (theme === 'Темная') {
        document.body.classList.add('dark-mode');
      }
    },
  },
  computed: {
    currentTranslations() {
      return language[this.selectedLanguage] || language['Русский'];
    },
    translatedDailyCards() {
      if (!this.daily || this.daily.length < 7) return [];
      return this.daily.slice(1, 7).map(day => ({
        time: day.time,
        temperature: this.round(day.temperature),
        feelsLike: this.round(day.feelsLike),
        weatherCode: day.weather_code,
        language: this.selectedLanguage,
      }));
    },
    convertSunriseTime() {
      return Convert.toTime(this.daily[0]?.sunrise) || '--:--';
    },
    convertSunsetTime() {
      return Convert.toTime(this.daily[0]?.sunset) || '--:--';
    },
    convertVisibility() {
      return Convert.toVisibilityDesc(this.daily[0]?.visibility, this.selectedLanguage) || 'None';
    },
    convertMinPressure() {
      return Convert.toMillimetersOfMercury(this.daily[0]?.pressure_min) || 0;
    },
    convertMaxPressure() {
      return Convert.toMillimetersOfMercury(this.daily[0]?.pressure_max) || 0;
    },
    hourlyForecast() {
      if (!this.daily[0]?.hourly) return [];
      return this.daily[0].hourly.map(hour => ({
        time: hour.time,
        temperature: this.round(hour.temperature),
        feelsLike: this.round(hour.apparent_temperature),
        weatherCode: hour.weather_code || 0,
        language: this.selectedLanguage,
      }));
    },
  },
};
</script>

<template>

  <div class="main-container">
    <Header
      :city="currentCity"
      :language="selectedLanguage"
      :theme="'Темная'"
      @update:language="updateLanguage"
    />
    <div v-if="isDataLoaded" class="forecast-row">
      <CurrentForecast
        :temperature="round(current.temperature)"
        :now="now"
        :language="selectedLanguage"
        :weather-code="current.weather_code"
      />
      <CurrentForecastDetails 
        :humidity="daily[0].humidity"
        :precipitation_probability="daily[0].precipitation_probability"
        :pressure_min="convertMinPressure"
        :pressure_max="convertMaxPressure"
        :wind_speed="daily[0].wind_speed"
        :visibility="convertVisibility"
        :sunrise="convertSunriseTime"
        :sunset="convertSunsetTime"
        :language="selectedLanguage"
      />
    </div>
    <div class="hourly-scroll-container">
      <HourlyCard
        v-for="(hour, idx) in hourlyForecast"
        :key="idx"
        :time="hour.time"
        :temperature="hour.temperature"
        :feelsLike="hour.feelsLike"
        :weatherCode="hour.weatherCode"
        :language="selectedLanguage"
      />
    </div>
    <h2 class="forecast-title">
      {{ currentTranslations.DailyCard.forecastTitle }}
    </h2>
    <div class="dailyContainer">
<DailyCard
    v-for="(card, idx) in translatedDailyCards"
    :key="idx"
    :time="card.time"
    :temperature="card.temperature"
    :feels-like="card.feelsLike"
    :weather-code="card.weatherCode"
    :language="card.language"
/>
    </div>
  </div>

</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
.main-container {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	width: 100%;
}
.forecast-row {
	display: flex;
	flex-direction: row;
	gap: 38px;
	margin: 0 auto;
	width: 100%;
	justify-content: space-between;
}
.forecast-row > *:last-child {
	min-width: 200px;
	flex: 0 1 475px;
}
.forecast-row > *:first-child {
	flex: 1;
}
.dailyContainer {
	margin-top: 50px;
	display: flex;
	flex-direction: row;
	gap: 39px;
	justify-content: flex-start;
	width: 100%;
}
</style>