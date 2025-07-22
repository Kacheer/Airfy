<template>
	<div class="forecast-container">
		<div class="weather-info">
			<div class="city">
				{{ translations.cities[city] || city }}
				<div class="country">{{ translations.country }}</div>
			</div>

			<div class="temperature-wrapper">
				<SvgIcon class="cloud-icon" name="cloud-v3 (Stroke)" /><span
					class="temperature"
					>{{ temperature }}°C</span
				>
			</div>

			<p class="condition">{{ translations.condition }}</p>

		</div>
		<p class="now">{{ translations.now || now }}</p>
	</div>
</template>

<script>
import SvgIcon from '../../public/SvgIcon.vue'
import Header from './Header.vue'
import language from '../lang/language.js'
export default {
	name: 'CurrentForecast',

	components: {
		SvgIcon,
		Header,
	},
	props: {
		city: {
			type: String,
			required: true,
		},
		temperature: {
			type: Number,
			required: true,
		},
		condition: {
			type: String,
			required: true,
		},
		now: {
			type: String,
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
	},
	computed: {
		translations() {
			return language[this.language] || language['Русский']
		},
	},
}
</script>

<style scoped>
.forecast-container {
	background: rgba(0, 0, 0, 0.4);
	border-radius: 12px;
	padding: 2rem;
	color: white;
	max-width: 100%;
	margin: 50px auto;
	backdrop-filter: blur(6px);
	position: relative;
	text-align: center;
	height: 400px;
	width: 70em;
}

.cloud-icon {
	width: 9em;
	height: 10em;
	fill: white;
}
.temperature-wrapper {
	position: absolute;
	top: 130px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	gap: 12px;
}

.city {
	position: absolute;
	top: 29px;
	left: 20px;
	padding-left: 29px;
	font-size: 1.8rem;
	font-weight: bold;
	text-align: left;
}
.country {
	font-size: 1rem;
	font-weight: normal;
	opacity: 0.7;
	margin-top: 0.2rem;
}
.now {
	font-size: 2.6rem;
	font-weight: bold;
	color: white;
	margin-top: -3px;
}

.temperature {
	font-size: 3.5rem;
	font-weight: bold;
	line-height: 1;
	margin-top: 1px;
}

.condition {
	position: absolute;
	top: 270px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 1.6rem;
}
</style>
