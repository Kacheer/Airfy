<template>
	<div class="forecast-container">
		<p>Город: {{ city }}</p>
		<p>Температура: {{ temperature }}°C</p>
		<p>Состояние: {{ condition }}</p>
		<p>Влажность: {{ humidity }}%</p>
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
		humidity: {
			type: Number,
			required: true,
		},
	},
}
</script>
<style scoped>
.forecast-container {
	background: rgba(0, 0, 0, 0.4);
	border-radius: 12px;
	padding: 1.5rem;
	color: white;
	text-align: center;
	max-width: 300px;
	margin: auto;
	backdrop-filter: blur(6px);
}

.city {
	font-size: 1.4rem;
	font-weight: bold;
}

.icon {
	margin-right: 0.5rem;
}

.condition {
	font-size: 1.1rem;
	margin-bottom: 0.3rem;
}

.humidity {
	font-size: 0.9rem;
	opacity: 0.7;
}
</style>
