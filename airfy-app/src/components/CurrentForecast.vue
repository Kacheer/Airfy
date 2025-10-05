<template>
	<div class="CurrentForecast glass-card">
		<div class="group">
			<div class="text-wrapper">{{ translations.Today }}</div>
			<div class="div">
				<SvgIcon
					class="cloud-icon"
					:name="icon"
					width="400"
					height="125"
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
			console.log('language in CurrentForecast:', language)
			return language[this.language] || language['Русский']
		},
		icon() {
			const res = Convert.toWeatherIcon(this.weatherCode)
			console.log('ВЫВЕЛО КАРТИНКУ ', res)
			return res.endsWith('.svg') ? res : res + '.svg'
		},
		weatherDesc() {
			return Convert.toWeatherDesc(this.weatherCode, this.language)
		},
	},
}
</script>

<style>
.div {
	display: flex;
	align-items: center;
	gap: 0px;
}
.CurrentForecast {
	width: 800px;
	height: auto;
	border-radius: 8px;
	padding: 30px;
	display: flex;
	border-radius: 20px;
	flex-direction: column;
	box-sizing: border-box;
	justify-content: space-between;
}

.CurrentForecast .group {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: auto;
}
.CurrentForecast .text-wrapper {
	color: #ffffff;
	font-family: 'Inter-Bold', Helvetica;
	font-size: 64px;
	font-weight: 700;
	height: 76px;
	text-align: center;
	font-size: 64px;
	margin-bottom: 20px;
	letter-spacing: 0;
	line-height: normal;
	white-space: nowrap;
	width: 626px;
}
.CurrentForecast .cloud-icon {
	height: 126.07px;
	position: relative;
	width: 200.95px;
	transform: scale(1.5);
}
.group-2 {
	display: flex;
	align-items: flex-start;
}
.temperature {
	font-size: 128px;
}
.text-wrapper-2 {
	font-size: 64px;
	margin-top: 10px;
}
.text-wrapper-3 {
	text-align: center;
	font-size: 36px;
	margin-top: 20px;
	color: #ffffffbf;
}
</style>
