<template>
	<div class="hourly-card">
		<p id="hour" class="card-time">{{ convertedTime }}</p>
		<SvgIcon
			:name="weatherIcon"
			:width="80"
			:height="80"
			:isWeatherIcons="true"
			class="card-icon"
		/>
		<p id="temperature" class="card-temp">{{ temperature }} °C</p>
		<p class="feelsLike card-description">{{ feelsLike }} °C</p>
	</div>
</template>

<script setup>
import SvgIcon from '../../public/SvgIcon.vue'
import Convert from '../services/Convert.js'

defineProps({
	time: {
		type: Number, // Теперь time — это Unix-время
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
		type: Number, // Добавлено для погодного кода
		required: true,
	},
	language: {
		// Добавлено для совместимости с языком
		type: String,
		required: true,
	},
})

const convertedTime = computed(() => {
	const time = Convert.toTime(props.time)
	console.log(`[HOURLY] Converted time for ${props.time}: ${time}`)
	return time
})
const weatherIcon = computed(() => {
	return Convert.toWeatherIcon(props.weatherCode) // Получаем иконку погоды
})
</script>

<style scoped>
.hourly-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
  min-width: 100px;
  transition: transform 0.3s ease;
}

.hourly-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.12);
}

.card-time {
  color: #667eea;
  font-weight: 700;
  font-size: 13px;
  margin-bottom: 8px;
}

.card-icon {
  margin: 8px 0;
}

.card-icon img {
  width: 45px;
  height: 45px;
  object-fit: contain;
}

.card-temp {
  color: #333333;
  font-weight: 700;
  font-size: 16px;
  margin-top: 8px;
}

.card-description {
  color: #888888;
  font-size: 11px;
  margin-top: 5px;
}
</style>
