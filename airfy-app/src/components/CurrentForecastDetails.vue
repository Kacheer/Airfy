<template>
	<div class="CurrentForecastDetails glass-card">
		<ul>
			<li>
				<SvgIcon name="moisture" />{{ translations.forecastDetails.humidity }}: {{humidity}} %
			</li>
			<li>
				<SvgIcon name="Vector" />{{translations.forecastDetails.chanceOfPrecipitation}}: {{precipitation_probability}} %
			</li>
		</ul>

		<hr />

		<ul>
			<li>
				<SvgIcon name="solar_arrow-down-broken" />{{translations.forecastDetails.minimumPressure}}: {{pressure_min}} мм рт. с.

			</li>
			<li>
				<SvgIcon name="solar_arrow-down-broken" />{{translations.forecastDetails.maximumPressure}}: {{pressure_max}} мм рт. с.
			</li>
		</ul>

		<hr />

		<ul>
			<li>
				<SvgIcon name="Vector (Stroke)" />{{ translations.forecastDetails.windSpeed }}: {{wind_speed }} м/с
			</li>
			<li>
				<SvgIcon name="Vector (2)" />{{ translations.forecastDetails.visibility }}: {{ visibility }}
			</li>
		</ul>

		<hr />

		<ul>
			<li>
				<SvgIcon name="v2 (Stroke) (1)" />{{ translations.forecastDetails.sunriseTime }}: {{ sunrise }}
			</li>
			<li>
				<SvgIcon name="v2 (Stroke)" />{{ translations.forecastDetails.sunsetTime }}: {{ sunset }}
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
		humidity: {
			type: Number,
			default: 0
		},
		precipitation_probability: {
			type: Number,
			default: 0
		},
		pressure_max: {
			type: Number,
			default: 0
		},
		pressure_min: {
			type: Number,
			default: 0
		},
		sunrise: {
			type: String,
			default: "--:--"
		},
		sunset: {
			type: String,
			default: "--:--"
		},
		wind_speed: {
			type: Number,
			default: 0
		},
		visibility: {
			type: String,
			default: "None"
		},
		language: {
			type: String,
			required: true,
		}
	},
	data() {
		return {
			weatherDesc: 'No description',
		}
	},
	computed: {
		translations() {
			return language[this.language] || language['Русский']
		}
	},
}
</script>
<style scoped>
.CurrentForecastDetails {
	padding: 15px 15px;
	/*Обнови браузер, у меня всё норм, свечения нет */
	/* backdrop-filter: none !important;
	box-shadow: none !important;
	filter: none !important;
	text-shadow: none !important; */
	color: white;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 10px;
	border-radius: 20px;
	box-sizing: border-box;
}

ul {
	list-style: none;
	padding: 0;
	margin: 0;

	display: flex;
	flex-direction: column;
	gap: 10px;
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
	font-weight: 400;
	font-size: 1.2vw;
	color: white;
	line-height: 1.4;
	text-shadow: none;
	filter: none;
}

hr {
	border: none;
	height: 2px;
	background: rgba(255, 255, 255, 0.2);
	margin: 5px 0px;
}
</style>
