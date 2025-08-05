<template>
	<div class="glass-card" id="card">
		<p id="time">{{ dayOfWeek }}</p>
		<SvgIcon
			:name="weatherIcon"
			:width="80"
			:height="80"
			:is-weather-icons="true"
		/>
		<p id="temperature">{{ temperature }} °C</p>
		<p class="feelsLike">{{ feelsLike }} °C</p>
		<p class="weather-description">{{ weatherDesc }}</p>
	</div>
</template>

<script>
import SvgIcon from '../../public/SvgIcon.vue'
import Convert from '../services/Convert.js'

export default {
	name: 'DailyCard', // Переименовал на DailyCard, так как это ежедневная карточка
	components: { SvgIcon },
	props: {
		time: {
			type: Number,
			required: true,
		},
		temperature: {
			type: Number,
			required: true,
		},
		feelsLike: {
			type: Number,
			required: true,
		},
		weatherCode: {
			type: Number,
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
	},
	computed: {
		dayOfWeek() {
			return Convert.toDayOfWeek(this.time, this.language) // Новая функция для дня недели
		},
		weatherIcon() {
			return Convert.toWeatherIcon(this.weatherCode)
		},
		weatherDesc() {
			return Convert.toWeatherDesc(this.weatherCode, this.language)
		},
	},
	mounted() {
		console.log('Weather description:', this.weatherDesc)
	},
}
</script>

<style scoped>
p {
	margin: 0;
	padding: 0;
}
.weather-description {
	color: #ffffffbf;
	font-weight: 500;
	text-align: center;
	width: fit-content;
}
#card {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: start;
	gap: 5px;
	width: 228px;
	height: 280px;

	padding: 0.625rem;
}
#time {
	font-size: 1.625rem;
	font-weight: 600;
	height: min-content;
	text-align: center;
	width: fit-content;
}
#temperature {
	font-size: 2rem;
	font-weight: 600;
	text-align: center;
	width: fit-content;
}
.feelsLike {
	font-size: 1.1875rem;
	font-weight: 600;
	text-align: center;
	color: rgba(255, 255, 255, 0.85);
	width: fit-content;
}
</style>
