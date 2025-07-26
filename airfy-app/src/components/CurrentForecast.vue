<template>
	<div class="CurrentForecast glass-card">
		<div class="group">
			<div class="text-wrapper">{{ translations.Today }}</div>
			<div class="div">
				<SvgIcon class="cloud-icon" name="cloud-v3 (Stroke)" width="200" height="125" />
				<div class="group-2">
					<div class="temperature">{{ temperature }}</div>
					<div class="text-wrapper-2">°C</div>
				</div>
			</div>
			<div class="text-wrapper-3">
				{{ translations.condition }}
			</div>
		</div>
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

<style>
.div {
	display: flex;
	align-items: center;
	gap: 20px;
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
