<template>
	<div class="daily-card">
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

<script setup>
import SvgIcon from '../../public/SvgIcon.vue'
import Convert from '../services/Convert.js'

defineProps({
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
})

const dayOfWeek = computed(() => {
	return Convert.toDayOfWeek(props.time, props.language) // Новая функция для дня недели
})
const weatherIcon = computed(() => {
	return Convert.toWeatherIcon(props.weatherCode)
})
const weatherDesc = computed(() => {
	return Convert.toWeatherDesc(props.weatherCode, props.language)
})

onMounted(() => {
	console.log('Weather description:', weatherDesc.value)
})
</script>

<style scoped>
.daily-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  min-height: 180px;
  display: flex;
  flex-direction: column;
}

.daily-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
}

.card-date {
  color: #667eea;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.card-icon {
  text-align: center;
  margin: 10px 0;
}

.card-icon img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.card-description {
  color: #555555;
  font-size: 13px;
  margin: 10px 0;
  text-align: center;
  min-height: 30px;
}

.card-temp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.temp-max {
  color: #333333;
  font-weight: 700;
  font-size: 18px;
}

.temp-min {
  color: #888888;
  font-size: 14px;
}

.card-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.detail-label {
  color: #888888;
}

.detail-value {
  color: #333333;
  font-weight: 600;
}

p {
	margin: 0;
	padding: 0;
	text-align: center;
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
