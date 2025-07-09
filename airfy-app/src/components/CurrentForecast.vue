<template>
	<div class="forecast-container">
		<div class="weather-info">
			<p class="city">Город: {{ city }}</p>
			<p class="temperature">Температура: {{ temperature }}°C</p>
			<p class="condition">Состояние: {{ condition }}</p>
		</div>
		<p class="now">Сейчас</p>
	</div>
</template>

<script>
export default {
	name: 'CurrentForecast',
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
	},
}
</script>

<style scoped>
.forecast-container {
	background: rgba(0, 0, 0, 0.4);
	border-radius: 12px;
	padding: 2rem;
	color: white;
	max-width: 500px;
	margin: 50px auto;
	backdrop-filter: blur(6px);
	position: relative;
	text-align: center;
	height: 400px;
}

.city {
	position: absolute;
	top: 20px;
	left: 20px;
	font-size: 1.4rem;
	font-weight: bold;
}
.now {
	top: 5px;
	font-size: 2.2rem;
	font-weight: bold;
	color: white;
}

.temperature {
	position: absolute;
	top: 130px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 2.5rem;
	font-weight: bold;
}

.condition {
	position: absolute;
	top: 300px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 1.2rem;
}

.humidity {
	position: absolute;
	top: 270px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 1rem;
	opacity: 0.7;
}
</style>
