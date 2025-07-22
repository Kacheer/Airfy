<script>
import CurrentForecast from './components/CurrentForecast.vue'
import Header from './components/Header.vue'
import CurrentForecastDetails from './components/CurrentForecastDetails.vue'
import apiBrowser from './browser_api/apiBrowser'
import apiForecast from './api/apiForecast'
export default {
	components: { CurrentForecast, Header, CurrentForecastDetails },
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
		<a href="https://vite.dev" target="_blank">
			<img src="/vite.svg" class="logo" alt="Vite logo" />
		</a>
		<button type="button" @click="increment()">Привет</button>
		<a href="https://vuejs.org/" target="_blank">
			<img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
		</a>
		<Header
			:city="currentCity"
			:language="selectedLanguage"
			:theme="'Темная'"
			@update:language="updateLanguage"
		/><CurrentForecast
			:city="currentCity"
			:temperature="temperature"
			:condition="condition"
			:now="now"
			:language="selectedLanguage"
		/>
		<CurrentForecastDetails :language="selectedLanguage" />
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
