<template>
	<div class="CurrentForecastDetails">
		<ul>
			<li>
				<SvgIcon name="moisture" />{{ translations.forecastDetails.humidity }}
			</li>
			<li>Вероятность осадков</li>
		</ul>

		<hr />

		<ul>
			<li>Минимальное давление</li>
			<li>Максимальное давление</li>
		</ul>

		<hr />

		<ul>
			<li>Скорость ветра</li>
			<li>Видимость</li>
		</ul>

		<hr />

		<ul>
			<li>
				<SvgIcon name="v2 (Stroke)" />{{
					translations.forecastDetails.sunsetTime
				}}
			</li>
			<li>
				<SvgIcon name="v2 (Stroke) (1)" />{{
					translations.forecastDetails.sunriseTime
				}}
			</li>
		</ul>
	</div>
</template>
<script>
import SvgIcon from '../../public/SvgIcon.vue'
import language from '../lang/language.js'

export default {
	name: 'CurrentForecastDetails',
	components: {
		SvgIcon,
	},
	props: {
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
<style scoped>
.CurrentForecastDetails {
	max-width: 400px;
	padding: 20px;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.15);
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex-grow: 1;
	height: 522px;
	border-radius: 20px;
}

ul {
	list-style: none;
	padding: 0;
	font-weight: bold;
	align-items: center;
}
.icon {
	width: 36px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

li {
	display: flex;
	align-items: center;
	gap: 12px;
	margin: 10px 0;
	font-size: 16px;
	line-height: 1;
}
hr {
	border: none;
	height: 2px;
	background: rgba(255, 255, 255, 0.2);
	margin: 15px 0;
}
</style>
