<template>
	<div class="footer">
		<div class="footer-content">
			<div class="Airfy-logo">Airfy</div>
			<div class="footer-text">
				<ul>
					<li>
						<a href="#" class="link-text">{{
							translations.footer.PrivacyPolicy
						}}</a>
					</li>
					<li>
						<a href="https://open-meteo.com/" class="link-text">{{
							translations.footer.OpenMeteoAPI
						}}</a>
					</li>
					<li>
						<a href="#" class="link-text"
							>{{ translations.footer.Security }}
						</a>
					</li>
					<li>
						<a href="#" class="social-link discord"
							><img
								src="../assets/discord.png"
								class="icon-social"
								alt="discord.png"
						/></a>
					</li>
					<li>
						<a href="#" class="social-link telegram">
							<img
								src="../assets/telegram.png"
								class="icon-social"
								alt="telegram.png"
						/></a>
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
.Airfy-logo {
	font-family: 'Montserrat';

	font-size: 75px;
}
.footer-content {
	padding: 35px 0px;
	display: flex;
	justify-content: space-between; /* Это нужно, чтобы логотип и ссылки не пересекались */
	align-items: center; /* Центрирует по вертикали */
}

.link-text {
	color: #a2a2a2;
	text-decoration: none;
	position: relative;
	transition: color 0.3s ease;
	display: flex; /* делаем flex-контейнером */
	align-items: center;
}
ul {
	font-size: 20px;
	display: flex;
	gap: 37px;
	list-style-type: none;
	justify-content: flex-end;
	align-items: center;
	padding: 0;
}
.icon-social {
	width: 30px;
}
.link-text::after {
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

.link-text:hover {
	color: #ffffff;
}

.link-text:hover::after {
	transform: scaleX(1);
}
.social-link {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 50px;
	height: 50px;
	border-radius: 50%; /* круг */
	transition: background-color 0.3s ease, transform 0.3s ease,
		box-shadow 0.3s ease;
}

.icon-social {
	width: 30px;
	transition: transform 0.3s ease;
}

/* Общий hover-эффект */
.social-link:hover {
	transform: scale(1.15); /* больше увеличиваем */
}
.social-link:hover .icon-social {
	transform: scale(1.25);
}

/* Discord */
.social-link.discord:hover {
	background-color: #5865f2;
	box-shadow: 0 0 20px #5865f2, 0 0 40px #5865f2;
}

/* Telegram */
.social-link.telegram:hover {
	background-color: #0088cc;
	box-shadow: 0 0 20px #0088cc, 0 0 40px #0088cc;
}
</style>
