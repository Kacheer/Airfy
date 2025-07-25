<template>
	<div class="forecast-container">
		<CurrentForecast
			:temperature="temperature"
			:condition="condition"
			:now="now"
			:language="language"
		/>

		<CurrentForecastDetails :language="language" />
	</div>
</template>

<script>
import CurrentForecast from './CurrentForecast.vue'
import CurrentForecastDetails from './CurrentForecastDetails.vue'
export default {
	name: 'ForecastContainer',
	components: {
		CurrentForecast,
		CurrentForecastDetails,
	},
	props: {
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
}
</script>
<style>
.forecast-container {
	display: flex;
	justify-content: flex-start;
	align-items: stretch;
	gap: 38px;
	margin: 0 auto;
	padding: 20px;
	overflow: auto;
}
</style>
