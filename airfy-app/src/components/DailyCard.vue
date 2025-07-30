<template>
	<div class="glass-card" id="card">
		<p id="time">{{ convertedTime }}</p>
		<SvgIcon :name="weatherIcon" :width="80" :height="80" :is-weather-icons="true" />
		<p id="temperature">{{ temperature }} °C</p>
		<p class="feelsLike">{{ feelsLike }} °C</p>
	</div>
</template>

<script>
import SvgIcon from '../../public/SvgIcon.vue'
import Convert from '../services/Convert.js'

export default {
	name: 'HourlyCard',
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
	mounted() {
		console.log("HourlyCard props:", {
			time: this.time,
			temperature: this.temperature,
			feelsLike: this.feelsLike,
			weatherCode: this.weatherCode,
			language: this.language
		});
	},
	computed: {
		convertedTime() {
			return Convert.toTime(this.time);
		},
		weatherIcon() {
			const icon = Convert.toWeatherIcon(this.weatherCode);
			console.log("HourlyCard weatherIcon:", icon);
			return icon;
		},
	},
}
</script>

<style scoped>
p {
	margin: 0;
	padding: 0;
}
#card {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: start;
	gap: 5px;
	width: 150px;
	height: fit-content;
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