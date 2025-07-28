<template>
	<div class="glass-card" id="card">
		<p id="title">{{ title }}</p>
		<SvgIcon name="cloud-v3 (Stroke)" :width="80" :height="80"></SvgIcon>
		<p id="temperature">{{ temperature }} °C</p>
		<p class="feelsLike">{{ feelsLike }} °C</p>
		<p id="weatherDesc">{{ weatherDescription }}</p>
	</div>
</template>

<script>
import SvgIcon from '../../public/SvgIcon.vue'

export default {
	name: 'DailyCard',
	components: { SvgIcon },
	props: {
		title: { type: String, required: true },
		temperature: { type: Number, required: true },
		feelsLike: { type: Number, required: true },
		weatherCode: { type: Number, required: true },
		translations: { type: Object, required: true },
	},
	computed: {
		weatherDescription() {
			return this.translations.DailyCard.weatherDescription
		},
		weatherIcon() {},
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
	gap: 10px;
	width: 228px;
	height: fit-content;
	padding: 0.625rem;
}
#title {
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
#weatherDesc {
	font-size: 1.1875rem;
	font-weight: 600;
	text-align: center;
	width: fit-content;
}
</style>
