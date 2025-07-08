<script>
import currentForecast from './api/current_forecast.js'
import HelloWorld from './components/HelloWorld.vue'
import CurrentForecast from './components/CurrentForecast.vue'
import Header from './components/Header.vue'
import { useStore } from './store/store.js'
import apiBrowser  from '../src/browser_api/apiBrowser.js'
export default {
	components: { HelloWorld, CurrentForecast, Header },
	data() {
		return {
			currentCity: 'London',
			cities: ['Paris', 'New York', 'Tokyo', 'Moscow', 'Berlin'],
		}
	},
	created() {
		this.store = useStore()
		currentForecast.fetchForecast(this.currentCity)
		apiBrowser.getPos()
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
	},
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
	</div>
	<CurrentForecast
		:city="currentCity"
		:temperature="temperature"
		:condition="condition"
		:humidity="humidity"
	/>
	<HelloWorld msg="Hello World !!!! Helooooooo" />

	<Header :city="currentCity" language="RU" theme="Темная" />
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
