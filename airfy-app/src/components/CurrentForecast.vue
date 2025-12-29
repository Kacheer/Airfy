<template>
	<div class="current-forecast">
		<div class="group">
			<div class="text-wrapper">{{ translations.Today }}</div>
			<div class="div">
				<SvgIcon
					class="cloud-icon"
					:name="icon"
					width="200"
					height="126"
					:is-weather-icons="true"
				/>
				<div class="group-2">
					<div class="temperature">{{ temperature }}</div>
					<div class="text-wrapper-2">°C</div>
				</div>
			</div>
			<div class="text-wrapper-3">
				{{ weatherDesc }}
			</div>
		</div>
	</div>
</template>

<script>
import SvgIcon from '../../public/SvgIcon.vue'
import Header from './Header.vue'
import language from '../lang/language.js'
import Convert from '../services/Convert.js'

export default {
	name: 'CurrentForecast',
	components: {
		SvgIcon,
		Header,
	},
	props: {
		temperature: {
			type: Number,
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
		weatherCode: {
			type: Number,
			default: 0,
		},
	},
	mounted() {
		console.log('CurrentForecast weatherCode:', this.weatherCode)
		console.log('Weather description:', this.weatherDesc)
	},
	computed: {
		translations() {
			return language[this.language] || language['Русский']
		},
		icon() {
			const res = Convert.toWeatherIcon(this.weatherCode)
			return res.endsWith('.svg') ? res : res + '.svg'
		},
		weatherDesc() {
			return Convert.toWeatherDesc(this.weatherCode, this.language)
		},
	},
}
</script>

<style scoped>
.div {
	display: flex;
	align-items: center;
	gap: 30px;
}

.current-forecast {
	background-color: #f0f0f0;
	border-radius: 12px;
	padding: 30px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	margin-bottom: 20px;
	width: 100%;
	max-width: 800px;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	justify-content: space-between;
}

.current-forecast .group {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
}

.current-forecast .text-wrapper {
	color: #333333;
	font-family: 'Inter-Bold', Helvetica;
	font-size: 64px;
	font-weight: 700;
	height: 76px;
	text-align: center;
	margin-bottom: 20px;
	letter-spacing: 0;
	line-height: normal;
	white-space: nowrap;
}

.cloud-icon {
	height: 126px;
	width: 200px;
}

.group-2 {
	display: flex;
	align-items: flex-start;
}

.temperature {
	font-size: 128px;
	color: #333333;
	font-weight: 700;
}

.text-wrapper-2 {
	font-size: 64px;
	color: #333333;
	margin-top: 10px;
}

.text-wrapper-3 {
	text-align: center;
	font-size: 36px;
	margin-top: 20px;
	color: #666666;
}

@media (max-width: 768px) {
	.current-forecast {
		padding: 20px;
	}

	.text-wrapper {
		font-size: 48px;
	}

	.temperature {
		font-size: 96px;
	}

	.text-wrapper-2 {
		font-size: 48px;
	}

	.text-wrapper-3 {
		font-size: 24px;
	}

	.div {
		gap: 15px;
	}
}
</style>
