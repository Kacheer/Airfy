<template>
	<div class="CurrentForecastDetails">
		<ul>
			<li>
				<SvgIcon name="moisture" />{{ translations.forecastDetails.humidity }}
			</li>
			<li>
				<SvgIcon name="Vector" />{{
					translations.forecastDetails.chanceOfPrecipitation
				}}
			</li>
		</ul>

		<hr />

		<ul>
			<li>
				<SvgIcon name="solar_arrow-down-broken" />{{
					translations.forecastDetails.minimumPressure
				}}
			</li>
			<li>
				<SvgIcon name="solar_arrow-down-broken" />{{
					translations.forecastDetails.maximumPressure
				}}
			</li>
		</ul>

		<hr />

		<ul>
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
	position: absolute;
	left: 61.09vw;
	top: 12.41vh;
	width: 28.7vw;
	height: 53.45vh;
	padding: 2vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	border-radius: 1.85vh;
	box-sizing: border-box;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.15);
}

ul {
	list-style: none;
	padding: 0;

	align-items: center;
	width: 27.19vw;
	height: 4.4vh;
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
	gap: 0.5vw;
	font-weight: 400;
	font-size: 1.2vw;
}
hr {
	border: none;
	height: 2px;
	background: rgba(255, 255, 255, 0.2);
	margin: 15px 0;
}
</style>
