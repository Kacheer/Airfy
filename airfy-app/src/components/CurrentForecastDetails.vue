<template>
	<div class="CurrentForecastDetails">
		<h2>{{ translations.forecastDetails.title }}</h2>
		<ul>
			<li>
				<SvgIcon name="v2 (Stroke) (1)" />{{
					translations.forecastDetails.morning
				}}
			</li>
			<li><SvgIcon name="Vector" />{{ translations.forecastDetails.day }}</li>
			<li>
				<SvgIcon name="v2 (Stroke)" />{{ translations.forecastDetails.evening }}
			</li>
			<li>
				<SvgIcon name="Subtract (Stroke)" />{{
					translations.forecastDetails.night
				}}
			</li>
		</ul>

		<hr />

		<h2>{{ translations.forecastDetails.additionalInfo }}</h2>
		<ul>
			<li>
				<SvgIcon name="Vector (1)" />{{
					translations.forecastDetails.feelsLike
				}}
			</li>
			<li>
				<SvgIcon name="moisture" />{{ translations.forecastDetails.humidity }}
			</li>
			<li>
				<SvgIcon name="Vector (Stroke)" />{{
					translations.forecastDetails.windSpeed
				}}
			</li>
			<li>
				<SvgIcon name="Vector (2)" />{{
					translations.forecastDetails.visibility
				}}
			</li>
			<li>
				<SvgIcon name="Union" />{{ translations.forecastDetails.pressure }}
			</li>
		</ul>

		<hr />

		<h2>{{ translations.forecastDetails.pressure }}</h2>
		<ul>
			<li>
				<SvgIcon name="Union (1)" />{{
					translations.forecastDetails.seaLevelPressure
				}}
			</li>
			<li>
				<SvgIcon name="Union (2)" />{{
					translations.forecastDetails.groundLevelPressure
				}}
			</li>
		</ul>

		<hr />

		<h2>{{ translations.forecastDetails.sunriseSunset }}</h2>
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
	color: #fff;
	font-family: Arial, sans-serif;
	padding: 20px;
	border-radius: 10px;
	text-align: left;
	padding-left: 15px;
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
