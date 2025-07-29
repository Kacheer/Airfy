<script>
import CurrentForecast from './components/CurrentForecast.vue'
import Header from './components/Header.vue'
import CurrentForecastDetails from './components/CurrentForecastDetails.vue'
import apiBrowser from './browser_api/apiBrowser'
import apiForecast from './api/apiForecast'
import ForecastContainer from './components/ForecastContainer.vue'
import DailyCard from './components/DailyCard.vue'
import language from './lang/language'
import HourlyCard from './components/HourlyCard.vue'
import DataService from './services/DataService'
import apiLocation from './api/apiLocation'
export default {
	components: {
		CurrentForecast,
		Header,
		CurrentForecastDetails,
		ForecastContainer,
		DailyCard,
		HourlyCard,
	},
	data() {
		return {
			currentCity: 'London',
			cities: ['Paris', 'New York', 'Tokyo', 'Moscow', 'Berlin'],

			selectedLanguage: 'Русский',
			temperature: 23,
			condition: 'Partly Cloudy',
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
			hourlyForecast: [
				{ time: '13:00', temp: 22, feelsLike: 19 },
				{ time: '14:00', temp: 24, feelsLike: 23 },
				{ time: '15:00', temp: 25, feelsLike: 25 },
				{ time: '16:00', temp: 25, feelsLike: 26 },
				{ time: '17:00', temp: 24, feelsLike: 26 },
				{ time: '18:00', temp: 23, feelsLike: 25 },
				{ time: '19:00', temp: 20, feelsLike: 23 },
				{ time: '21:00', temp: 21, feelsLike: 20 },
				{ time: '21:00', temp: 21, feelsLike: 20 },
			],
			units: null,
			current: {
				temperature: null,
				weatherCode: null,
			},
			daily: [],
			isDataLoaded: false,
		}
	},

	created() {
		const savedTheme = localStorage.getItem('theme')
		if (savedTheme) {
			this.selectedTheme = savedTheme
			this.applyTheme(savedTheme)
		}
		apiBrowser.getPos()
		apiForecast.fetchForecast()
	}, //ggggg
	async mounted() {
		console.log('Начало получения позиции')
		try {
			const userPos = await apiBrowser.getPos()
			DataService.addPosToStore(userPos.lat, userPos.long)
			console.log('Координаты получены и сохранены')
			await apiForecast.fetchForecast()
			this.currentCity = await apiLocation.getCityNameByStore()
			console.log('Прогноз получен')
			const data = DataService.getAllData()
			this.daily = data.daily
			this.units = data.units
			this.current = data.current
			this.isDataLoaded = true // Данные готовы, можно рендерить!
			console.log(
				`В РАЗМЕТКЕ ПОЛУЧЕНЫ: ${this.units} \n ${this.current}\n${this.daily[0].temperature}`
			)
		} catch (error) {
			console.error('Ошибка при получении данных:', error)
			this.currentCity = 'Moscow'
			await apiForecast.fetchForecast()
			this.isDataLoaded = true // Или оставь false, если хочешь
		}
	},
	methods: {
		increment(index) {
			this.currentCity = this.cities[index]
			this.setStore()
		},
		setStore() {
			this.store.setCurrentCity(this.currentCity)
			console.log('Store city:', this.store.currentCity)
		},
		updateLanguage(newLang) {
			this.selectedLanguage = newLang
		},
		round(number) {
			return Math.round(number)
		},
		// getResponse() {
		// 	DataService.setStore({data: 'test data'})
		// }
		updateTheme(newTheme) {
			this.selectedTheme = newTheme
			localStorage.setItem('theme', newTheme)
			this.applyTheme(newTheme)
		},
		applyTheme(theme) {
			document.body.classList.remove('dark-mode')
			if (theme === 'Темная') {
				document.body.classList.add('dark-mode')
			}
		},
	},
	computed: {
		currentTranslations() {
			return language[this.selectedLanguage] || language['Русский']
		},
		translatedDailyCards() {
			return this.dailyCards.map(card => ({
				...card,
				title: this.currentTranslations.DailyCard[card.title] || card.title,
			}))
		},
	},
}
</script>

<template>
	<div class="main-container">
		<Header
			:city="currentCity"
			:language="selectedLanguage"
			:theme="'Темная'"
			@update:language="updateLanguage"
			@update:theme="updateTheme"
		/>
		<div v-if="isDataLoaded" class="forecast-row">
			<CurrentForecast
				:temperature="round(current.temperature)"
				:condition="condition"
				:now="now"
				:language="selectedLanguage"
			/>
			<CurrentForecastDetails
				:humidity="daily[0].humidity"
				:precipitation_probability="daily[0].precipitation_probability"
				:pressure_min="daily[0].pressure_min"
				:pressure_max="daily[0].pressure_max"
				:wind_speed="daily[0].wind_speed"
				:visibility="daily[0].visibility"
				:sunrise="daily[0].sunrise"
				:sunset="daily[0].sunset"
				:language="selectedLanguage"
			/>
		</div>
		<!-- Остальной код шаблона -->
		<div class="hourly-scroll-container">
			<HourlyCard
				v-for="(hour, idx) in hourlyForecast"
				:key="idx"
				:hour="hour.time"
				:temperature="hour.temp"
				:feelsLike="hour.feelsLike"
			/>
		</div>
		<h2 class="forecast-title">
			{{ currentTranslations.DailyCard.forecastTitle }}
		</h2>
		<div class="dailyContainer">
			<DailyCard
				v-for="(card, idx) in translatedDailyCards"
				:key="idx"
				:title="card.title"
				:temperature="card.temperature"
				:feels-like="card.feelsLike"
				:weather-code="card.weatherCode"
				:translations="currentTranslations"
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
