<template>
	<div class="footer">
		<div class="footer-content">
			<div class="logo">
				<img
					:src="currentIcon"
					alt="Cloud background"
					class="cloud-background"
				/>
			</div>
			<div class="Airfy">
				<h1>Airfy</h1>
			</div>
			<div class="footer-text">
				<ul>
					<li>{{ translations.footer.Support }}</li>
					<li>
						<a href="#">{{ translations.footer.Help }}</a>
					</li>
					<li>
						<a href="#">{{ translations.footer.Contact }}</a>
					</li>
				</ul>
				<ul>
					<li>{{ translations.footer.Information }}</li>
					<li>
						<a href="#">{{ translations.footer.PrivacyPolicy }}</a>
					</li>
					<li>
						<a href="#">{{ translations.footer.OpenMeteoAPI }}</a>
					</li>
					<li>
						<a href="#">{{ translations.footer.Security }}</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import language from '../lang/language.js'
export default {
	name: 'Footer',
	props: {
		selectedTheme: String,
		language: {
			type: String,
			required: true,
		},
	},
	computed: {
		currentIcon() {
			if (this.selectedTheme === 'Темная') {
				return '/src/assets/weather-icons/cloud-dark.svg'
			}
			return '/src/assets/weather-icons/cloud-blue.svg'
		},
		translations() {
			return language[this.language] || language['Русский']
		},
	},
	language: {
		type: String,
		required: true,
	},
}
</script>

<style scoped>
.footer {
	width: 100%; /* Занимает всю ширину */
	padding: 150px 158px; /* Отступы сверху/снизу и по бокам */
	font-family: 'Montserrat', sans-serif;
	position: relative; /* ВАЖНО: родитель должен быть относительно позиционирован */
	overflow: hidden;
	box-sizing: border-box;
}

.footer-content {
	position: relative; /* чтобы элементы были поверх */
	z-index: 1;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	flex-wrap: wrap;
	width: 100%;
}

.Airfy {
	flex-shrink: 0;
}

.Airfy h1 {
	font-size: 115px;
	margin: 0;
	text-align: left;
}

.footer-text {
	display: flex;
	gap: 250px; /* Больше расстояние между блоками Support и Information */
}

.footer-text ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.footer-text li {
	font-size: 18px;
	margin-bottom: 10px;
	color: #a2a2a2;
}

.footer-text li:first-child {
	color: #ffffff;
	font-weight: bold;
	font-size: 22px;
}
.cloud-background {
	position: absolute;
	top: 50%; /* Центр по вертикали */
	right: 20px; /* Чуть отступ от правого края */
	transform: translateY(-50%); /* Чуть ниже центра */
	width: 500px;
	height: auto;
	opacity: 0.35;
	z-index: 0;
	pointer-events: none;
}
.footer-text a {
	color: #a2a2a2;
	text-decoration: none;
	position: relative;
	transition: color 0.3s ease;
}

.footer-text a::after {
	content: '';
	position: absolute;
	left: 0;
	bottom: -2px;
	width: 100%;
	height: 1px;
	background-color: #ffffff;
	transform: scaleX(0);
	transform-origin: left;
	transition: transform 0.3s ease;
}

.footer-text a:hover {
	color: #ffffff;
}

.footer-text a:hover::after {
	transform: scaleX(1);
}
</style>
