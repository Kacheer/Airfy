<script>
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

import CurrentForecast from './components/CurrentForecast.vue'
import Header from './components/Header.vue'
import CurrentForecastDetails from './components/CurrentForecastDetails.vue'
import apiBrowser from './browser_api/apiBrowser'
import apiForecast from './api/apiForecast'
import DailyCard from './components/DailyCard.vue'
import language from './lang/language'
import HourlyCard from './components/HourlyCard.vue'
import DataService from './services/DataService'
import apiLocation from './api/apiLocation'
import Convert from './services/Convert.js'
import { useServerStore } from './store/Serverstore'
import LoadingScreen from './components/LoadingScreen.vue'

import Footer from './components/Footer.vue'

gsap.registerPlugin(ScrollToPlugin)

export default {
	components: {
		CurrentForecast,
		Header,
		CurrentForecastDetails,
		DailyCard,
		HourlyCard,
		LoadingScreen,

		Footer,
	},
	data() {
		return {
			currentCity: 'London',
			cities: ['Paris', 'New York', 'Tokyo', 'Moscow', 'Berlin'],

			selectedLanguage: '',
			selectedTheme: '', // или 'Светлая'

			selectedLanguage: 'Русский',

			temperature: 23,
			now: 'Now',
			dailyCards: [
				{
					time: Date.now() / 1000 + 86400, // Tomorrow
					temperature: 23,
					feelsLike: 19,
					weatherCode: 1,
				},
				{
					time: Date.now() / 1000 + 2 * 86400, // Tuesday
					temperature: 25,
					feelsLike: 20,
					weatherCode: 2,
				},
				{
					time: Date.now() / 1000 + 3 * 86400, // Wednesday
					temperature: 25,
					feelsLike: 20,
					weatherCode: 2,
				},
				{
					time: Date.now() / 1000 + 4 * 86400, // Thursday
					temperature: 25,
					feelsLike: 20,
					weatherCode: 2,
				},
				{
					time: Date.now() / 1000 + 5 * 86400, // Friday
					temperature: 25,
					feelsLike: 20,
					weatherCode: 2,
				},
				{
					time: Date.now() / 1000 + 6 * 86400, // Saturday
					temperature: 25,
					feelsLike: 20,
					weatherCode: 2,
				},
			],
			units: null,
			current: {
				temperature: null,
				weather_code: null,
			},
			daily: [],
			showLoader: true,
			loaderStage: 'fetching',
			isDragging: false,
			isSnapping: false,
			scrollTimeout: null,
		}
	},
	created() {
		const savedTheme = localStorage.getItem('theme')
		if (savedTheme) {
			this.selectedTheme = savedTheme
			this.applyTheme(savedTheme)
		}

		// Определение языка пользователя
		const browserLanguage = navigator.language.split('-')[0]
		console.log('[APP] Язык браузера:', browserLanguage)

		const languageMap = {
			ru: 'Русский',
			en: 'English',
			// Можно добавить другие языки типо
		}

		// Проверяем, поддерживается ли язык браузера
		const mappedLanguage = languageMap[browserLanguage]
		if (mappedLanguage && language[mappedLanguage]) {
			this.selectedLanguage = mappedLanguage
			console.log('[APP] Установлен язык из браузера:', mappedLanguage)
		} else {
			this.selectedLanguage = 'English'
			console.log(
				'[APP] Язык браузера не поддерживается, установлен English по умолчанию'
			)
		}
	},
	mounted() {
		const serverStore = useServerStore()
		console.log('[APP] Начало получения позиции')

		if (serverStore.loadState()) {
			const data = DataService.getAllData()
			this.units = data.units
			this.current = data.current
			this.daily = data.daily
			this.applyTheme(this.selectedTheme)
			this.$nextTick(() => {
				this.waitUntilAllLoaded()
			})
			console.log('[APP] Данные загружены из localStorage:', data)
		}

		this.fetchData()

		setInterval(() => {
			console.log('[APP] Запуск автоматического обновления данных')
			this.fetchData()
		}, 10 * 60 * 1000)

		this.initScrollableSnap()
		gsap.from(
			'.header-container, .CurrentForecast, .CurrentForecastDetails, .hourly-scroll-container, .dailyContainer, .footer',

			'.header-container, .CurrentForecast, .CurrentForecastDetails, .hourly-scroll-container, .dailyContainer',

			{
				opacity: 0,
				y: 30,
				duration: 2,
				ease: 'power3.out',
				stagger: 0.3,
				delay: 0.3,
			}
		)
	},
	methods: {
		async fetchData() {
			const serverStore = useServerStore()
			this.showLoader = true
			this.loaderStage = 'fetching'
			try {
				this.loaderStage = 'requesting'
				const userPos = await apiBrowser.getPos()
				DataService.addPosToStore(userPos.lat, userPos.long)
				this.currentCity = await apiLocation.getCityNameByStore()
				await apiForecast.fetchForecast()
				this.loaderStage = 'showing'
				const data = DataService.getAllData()
				this.units = data.units
				this.current = data.current
				this.daily = data.daily
				this.applyTheme(this.selectedTheme)
				this.$nextTick(() => {
					this.waitUntilAllLoaded()

					// Анимация при загрузке
					const timeline = gsap.timeline({ delay: 0 })

					timeline
						.from('.header-container', {
							y: 30,
							opacity: 0,
							duration: 0.8,
							ease: 'power2.out',
						})
						.from(
							'.CurrentForecast',
							{
								y: 30,
								opacity: 0,
								duration: 0.8,
								ease: 'power2.out',
							},
							'-=0.3'
						)
						.from(
							'.CurrentForecastDetails',
							{
								y: 30,
								opacity: 0,
								duration: 0.8,
								ease: 'power2.out',
							},
							'-=0.3'
						)
						.from(
							'.hourly-card',
							{
								y: 20,
								opacity: 0,
								duration: 0.2,
								stagger: 0.015,
								ease: 'power2.out',
							},
							'-=2'
						)

						.from(
							'.hourly-scroll-container',
							{
								y: 30,
								opacity: 0,
								duration: 0.5,
								ease: 'power2.out',
							},
							'-=0.2'
						)
						.from(
							'.forecast-title',
							{
								y: 30,
								opacity: 0,
								duration: 0.5,
								ease: 'power2.out',
							},
							'-=0.2'
						)
						.from(
							'.dailyContainer > *',
							{
								y: 30,
								opacity: 0,
								duration: 0.5,
								stagger: 0.1,
								ease: 'power2.out',
							},
							'-=0.2'
						)

						.from(
							'.footer',
							{
								y: 30,
								opacity: 0,
								duration: 0.5,
								ease: 'power2.out',
							},
							'-=0.2'
						)
				})
			} catch (error) {
				this.loaderStage = 'showing'
				this.currentCity = 'Moscow'
				await apiForecast.fetchForecast(true)
				const data = DataService.getAllData()
				this.units = data.units
				this.current = data.current
				this.daily = data.daily
				this.applyTheme(this.selectedTheme)
				this.$nextTick(() => {
					this.waitUntilAllLoaded()
				})
			}
		},
		increment(index) {
			this.currentCity = this.cities[index]
			this.setStore()
		},
		setStore() {
			const userStore = require('./store/userStore').useUserStore(
				require('./store/index')
			)
			userStore.setUserPos(null, null)
			apiForecast.fetchForecast(true)
		},
		updateLanguage(newLang) {
			console.log('[APP] Updated language:', newLang)
			this.selectedLanguage = newLang
		},
		round(number) {
			return Math.round(number)
		},
		updateTheme(newTheme) {
			this.selectedTheme = newTheme
			localStorage.setItem('theme', newTheme)
			this.applyTheme(newTheme)
		},
		applyTheme(theme) {
			document.body.classList.remove('dark-mode')
			if (theme === 'Темная') {
				document.body.classList.add('dark-mode')
			}
		},
		initScrollableSnap() {
			const container = this.$refs.scrollContainer
			if (!container) return

			container.scrollLeft = 0
			console.log(
				'[APP] Container width:',
				container.offsetWidth,
				'First card offsetLeft:',
				container.querySelector('.hourly-card')?.offsetLeft
			)

			let startX = 0
			let scrollLeft = 0
			let isDragging = false

			const startDrag = e => {
				if (this.isSnapping) return
				isDragging = true
				this.isDragging = true
				container.classList.add('dragging')
				startX =
					(e.pageX || (e.touches && e.touches[0].pageX)) - container.offsetLeft
				scrollLeft = container.scrollLeft
				gsap.killTweensOf(container)
			}

			const onDrag = e => {
				if (!isDragging) return
				e.preventDefault()
				const x =
					(e.pageX || (e.touches && e.touches[0].pageX)) - container.offsetLeft
				const walk = (x - startX) * 2
				container.scrollLeft = scrollLeft - walk
			}

			const stopDrag = () => {
				if (!isDragging) return
				isDragging = false
				this.isDragging = false
				container.classList.remove('dragging')
				this.snapToNearestCard()
			}

			const onScroll = () => {
				if (this.isSnapping || this.isDragging) return
				if (this.scrollTimeout) clearTimeout(this.scrollTimeout)
				this.scrollTimeout = setTimeout(() => {
					this.snapToNearestCard()
				}, 150)
			}

			this.snapToNearestCard = () => {
				if (this.isSnapping) return
				this.isSnapping = true

				const cards = container.querySelectorAll('.hourly-card')
				if (cards.length === 0) {
					this.isSnapping = false
					return
				}

				const containerRect = container.getBoundingClientRect()
				let closestCard = null
				let minDistance = Infinity
				let closestCardIndex = 0

				cards.forEach((card, index) => {
					const cardRect = card.getBoundingClientRect()
					const cardLeftRelative = cardRect.left - containerRect.left
					const distance = Math.abs(cardLeftRelative)
					if (distance < minDistance) {
						minDistance = distance
						closestCard = card
						closestCardIndex = index
					}
				})

				if (closestCard) {
					let targetScrollLeft
					if (closestCardIndex === 0 && container.scrollLeft < 50) {
						targetScrollLeft = 0
					} else {
						targetScrollLeft = closestCard.offsetLeft
					}

					gsap.to(container, {
						scrollLeft: targetScrollLeft,
						duration: 0.3,
						ease: 'power2.out',
						onComplete: () => {
							this.isSnapping = false
							console.log(
								'[APP] Snapped to card',
								closestCardIndex,
								'at scrollLeft:',
								targetScrollLeft
							)
						},
					})
				} else {
					this.isSnapping = false
				}
			}

			container.addEventListener('mousedown', startDrag)
			container.addEventListener('mousemove', onDrag)
			container.addEventListener('mouseup', stopDrag)
			container.addEventListener('mouseleave', stopDrag)

			container.addEventListener('touchstart', startDrag)
			container.addEventListener('touchmove', onDrag)
			container.addEventListener('touchend', stopDrag)

			container.addEventListener('scroll', onScroll)

			this.$once('hook:beforeDestroy', () => {
				container.removeEventListener('mousedown', startDrag)
				container.removeEventListener('mousemove', onDrag)
				container.removeEventListener('mouseup', stopDrag)
				container.removeEventListener('mouseleave', stopDrag)
				container.removeEventListener('touchstart', startDrag)
				container.removeEventListener('touchmove', onDrag)
				container.removeEventListener('touchend', stopDrag)
				container.removeEventListener('scroll', onScroll)
				if (this.scrollTimeout) clearTimeout(this.scrollTimeout)
			})
		},
		waitUntilAllLoaded() {
			const images = Array.from(document.images)
			const svgs = Array.from(document.querySelectorAll('svg'))
			let total = images.length + svgs.length
			if (total === 0) {
				this.showLoader = false
				return
			}
			let loaded = 0
			const check = () => {
				loaded++
				if (loaded >= total) {
					setTimeout(() => {
						this.showLoader = false
						this.loaderStage = 'fetching'
					}, 200)
				}
			}
			images.forEach(img => {
				if (img.complete) {
					check()
				} else {
					img.addEventListener('load', check)
					img.addEventListener('error', check)
				}
			})
			svgs.forEach(svg => {
				setTimeout(check, 100)
			})
		},
		scrollToForecast() {
			const forecast = document.querySelector('.forecast-row')
			if (forecast) {
				gsap.to(window, {
					scrollTo: forecast,
					duration: 1,
					ease: 'power2.out',
				})
			}
		},
		scrollToDaily() {
			const targetElement = document.querySelector('.dailyContainer')
			if (targetElement) {
				gsap.to(window, {
					scrollTo: { y: targetElement, offsetY: 80 },
					duration: 1.2,
					ease: 'power2.out',
				})
			}
		},
	},
	computed: {
		currentTranslations() {
			return language[this.selectedLanguage] || language['Русский']
		},
		translatedDailyCards() {
			if (!this.daily || this.daily.length < 7) return []
			return this.daily.slice(1, 7).map(day => ({
				time: day.time,
				temperature: this.round(day.temperature),
				feelsLike: this.round(day.feelsLike),
				weatherCode: day.weather_code,
				language: this.selectedLanguage,
			}))
		},
		convertSunriseTime() {
			return Convert.toTime(this.daily[0]?.sunrise) || '--:--'
		},
		convertSunsetTime() {
			return Convert.toTime(this.daily[0]?.sunset) || '--:--'
		},
		convertVisibility() {
			return (
				Convert.toVisibilityDesc(
					this.daily[0]?.visibility,
					this.selectedLanguage
				) || 'None'
			)
		},
		convertMinPressure() {
			return Convert.toMillimetersOfMercury(this.daily[0]?.pressure_min) || 0
		},
		convertMaxPressure() {
			return Convert.toMillimetersOfMercury(this.daily[0]?.pressure_max) || 0
		},
		hourlyForecast() {
			if (!this.daily[0] || !Array.isArray(this.daily[0].hourly)) return []
			return this.daily[0].hourly
				.filter(hour => hour && typeof hour.time !== 'undefined')
				.map(hour => ({
					time: hour.time,
					temperature: this.round(hour.temperature ?? 0),
					feelsLike: this.round(hour.apparent_temperature ?? 0),
					weatherCode: hour.weather_code ?? 0,
					language: this.selectedLanguage,
				}))
		},
		loaderStageText() {
			const lang = this.selectedLanguage || 'Русский'
			return language[lang]?.loadingStages?.[this.loaderStage] || 'Загрузка...'
		},
	},
}
</script>

<template>
	<div class="main-container">
		<Header
			:city="currentCity"
			:language="selectedLanguage"
			:theme="selectedTheme"
			@update:language="updateLanguage"
			@update:theme="updateTheme"
		/>
		<div class="forecast-row">
			<CurrentForecast
				:temperature="round(current.temperature)"
				:now="now"
				:language="selectedLanguage"
				:weatherCode="current.weather_code ?? 0"
			/>
			<CurrentForecastDetails
				:humidity="daily[0]?.humidity"
				:precipitation_probability="daily[0]?.precipitation_probability"
				:pressure_min="convertMinPressure"
				:pressure_max="convertMaxPressure"
				:wind_speed="daily[0]?.wind_speed"
				:visibility="convertVisibility"
				:sunrise="convertSunriseTime"
				:sunset="convertSunsetTime"
				:language="selectedLanguage"
			/>
		</div>
		<div class="hourly-scroll-container" ref="scrollContainer">
			<HourlyCard
				v-for="(hour, idx) in hourlyForecast"
				:key="idx"
				:time="hour.time"
				:temperature="hour.temperature"
				:feelsLike="hour.feelsLike"
				:weatherCode="hour.weatherCode"
				:language="selectedLanguage"
				class="hourly-card"
			/>
		</div>
		<h2 class="forecast-title">
			{{ currentTranslations.DailyCard.forecastTitle }}
		</h2>
		<div class="dailyContainer">
			<DailyCard
				v-for="(card, idx) in translatedDailyCards"
				:key="idx"
				:time="card.time"
				:temperature="card.temperature"
				:feelsLike="card.feelsLike"
				:weatherCode="card.weatherCode"
				:language="card.language"
			/>
		</div>

		<Footer :language="selectedLanguage" :selectedTheme="selectedTheme" />

		<LoadingScreen
			:show="showLoader"
			:theme="selectedTheme"
			:stageText="loaderStageText"
		/>
	</div>
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
.main-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	max-width: 1280px;
	margin: 0 auto;
	padding: 0 20px;
}
.forecast-row {
	display: flex;
	flex-direction: row;
	gap: 38px;
	width: 100%;
	justify-content: space-between;
}
.forecast-row > *:last-child {
	min-width: 200px;
	flex: 0 1 475px;
}
.forecast-row > *:first-child {
	flex: 1;
}
.dailyContainer {
	margin-top: 50px;
	display: flex;
	flex-direction: row;
	gap: 39px;
	justify-content: flex-start;
	width: 100%;
}
.hourly-scroll-container {
	display: flex;
	overflow-x: auto;
	gap: 20px;
	padding: 10px 0;
	scroll-behavior: auto;
	width: 100%;
	max-width: 1280px;
	margin: 0 auto;
	margin-top: 20px;
}
.hourly-scroll-container.dragging {
	cursor: grabbing;
	user-select: none;
}
.hourly-card {
	flex: 0 0 auto;
	width: 223px;
}
</style>
