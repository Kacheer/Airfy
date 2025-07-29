<template>
	<div class="glass-card" id="card">
		<p id="hour">{{ hour }}</p>
		<SvgIcon name="cloud-v3 (Stroke)" :width="80" :height="80"></SvgIcon>

		<p id="temperature">{{ temperature }} °C</p>
		<p class="feelsLike">{{ feelsLike }} °C</p>
	</div>
</template>
<script>
import SvgIcon from '../../public/SvgIcon.vue'

export default {
	name: 'HourlyCard',
	components: { SvgIcon },
	props: {
		hour: {
			type: String,
			required: true,
		},
		feelsLike: { type: Number, required: true },

		temperature: {
			type: Number,
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
#temperature {
	font-size: 1.5rem;
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
p {
	margin: 0;
	padding: 0;
	text-align: center;
	width: fit-content;
}
#card {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: start;
	gap: 10px;
	width: 223px;
}

#hour {
	font-size: 2rem;
	font-weight: 400;
	text-align: center;
	width: fit-content;
}
</style>
