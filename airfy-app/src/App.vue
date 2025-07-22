<script>
import HelloWorld from './components/HelloWorld.vue'
import CurrentForecast from './components/CurrentForecast.vue'
import Header from './components/Header.vue'
import CurrentForecastDetails from './components/CurrentForecastDetails.vue'
import apiBrowser from './browser_api/apiBrowser'
import apiForecast from './api/apiForecast'
export default {
	components: { HelloWorld, CurrentForecast, Header, CurrentForecastDetails },
	data() {
		return {
			currentCity: 'London',
			cities: ['Paris', 'New York', 'Tokyo', 'Moscow', 'Berlin'],
			userPos: {
				lat: null,
				long: null
			},
			temperature: 20,
			condition: 'Небольшая облачность'
		}
	},
	methods: {
		// getResponse() { 
		// 	DataService.setStore({data: 'test data'})
		// }
	},
	created() {
		apiBrowser.getPos()
		apiForecast.fetchForecast()
	},
	computed: {
		getUserPos() {
			// Используем правильное имя хранилища 'userStore'
			const userPos = this.$store?.userStore?.userPos;
			console.log('Computed response:', userPos);
			return userPos; 
		}
	}
}
</script>

<template>
	<Header :city="currentCity" language="RU" theme="Темная" />
	<CurrentForecast
		:city="currentCity"
		:temperature="temperature"
		:condition="condition"
	/>
	<CurrentForecastDetails />
	<p>{{ getUserPos }}</p>
	<!-- <button @click="getResponse">Обновить данные</button> -->
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
