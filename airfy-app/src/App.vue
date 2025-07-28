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
		}
	},

	created() {
		apiBrowser.getPos()
		apiForecast.fetchForecast()
	},
	async mounted() {
		console.log('Начало получения позиции')

		try {
			const userPos = await apiBrowser.getPos()

			DataService.addPosToStore(userPos.lat, userPos.long)

			console.log('Координаты получены и сохранены')

			await apiForecast.fetchForecast()

			console.log('Прогноз получен')
		} catch (error) {
			console.error('Ошибка при получении данных:', error)
			this.currentCity = 'Moscow'
			await apiForecast.fetchForecast()
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
		// getResponse() {
		// 	DataService.setStore({data: 'test data'})
		// }
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
		/>
		<div class="forecast-row">
			<CurrentForecast
				:temperature="temperature"
				:condition="condition"
				:now="now"
				:language="selectedLanguage"
			/>
			<CurrentForecastDetails :language="selectedLanguage" />
		</div>
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
	width: 400px;
	min-width: 200px;
	flex: 0 1 400px;
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
