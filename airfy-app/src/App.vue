<script>
import CurrentForecast from './components/CurrentForecast.vue'
import Header from './components/Header.vue'
import CurrentForecastDetails from './components/CurrentForecastDetails.vue'
import apiBrowser from './browser_api/apiBrowser'
import apiForecast from './api/apiForecast'
import ForecastContainer from './components/ForecastContainer.vue'
export default {
	components: {
		CurrentForecast,
		Header,
		CurrentForecastDetails,
		ForecastContainer,
	},
	data() {
		return {
			currentCity: 'London',
			cities: ['Paris', 'New York', 'Tokyo', 'Moscow', 'Berlin'],

			selectedLanguage: 'Русский',
			temperature: 23,
			condition: 'Partly Cloudy',
			now: 'Now',
		}
	},
	// methods: {
	// getResponse() {
	// 	DataService.setStore({data: 'test data'})
	// }
	// },
	created() {
		apiBrowser.getPos()
		apiForecast.fetchForecast()
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
	},
	computed: {},
}
</script>

<template>
	<div>
		<Header
			:city="currentCity"
			:language="selectedLanguage"
			:theme="'Темная'"
			@update:language="updateLanguage"
		/><ForecastContainer
			:temperature="temperature"
			:condition="condition"
			:now="now"
			:language="selectedLanguage"
		/>
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
</style>
