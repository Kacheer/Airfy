<template>
	<div class="CurrentForecastDetails">
		<h2>Подробная информация</h2>
		<ul>
			<li><SvgIcon name="v2 (Stroke) (1)" />Утром</li>
			<li><SvgIcon name="Vector" />Днём</li>
			<li><SvgIcon name="v2 (Stroke)" />Вечером</li>
			<li><SvgIcon name="Subtract (Stroke)" />Ночью</li>
		</ul>

		<hr />

		<h2>Дополнительные сведения</h2>
		<ul>
			<li><SvgIcon class="icon" name="Vector (1)" />Ощущается как</li>
			<li><SvgIcon name="moisture" />Влажность</li>
			<li><SvgIcon name="Vector (Stroke)" />Скорость ветра</li>
			<li><SvgIcon name="Vector (2)" />Видимость</li>
			<li><SvgIcon name="Union" />Давление</li>
		</ul>

		<hr />

		<h2>Давление</h2>
		<ul>
			<li><SvgIcon name="Union (1)" />Давление над ур. моря</li>
			<li><SvgIcon name="Union (2)" />Давление на ур. земли</li>
		</ul>

		<hr />

		<h2>Восход / Закат</h2>
		<ul>
			<li><SvgIcon name="v2 (Stroke)" />Время заката</li>
			<li><SvgIcon name="v2 (Stroke) (1)" />Время восхода</li>
		</ul>
	</div>
</template>
<script>
import SvgIcon from './SvgIcon.vue'
export default {
	name: 'CurrentForecastDetails',
	components: {
		SvgIcon,
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
}
hr {
	border: none;
	height: 2px;
	background: rgba(255, 255, 255, 0.2);
	margin: 15px 0;
}
</style>
