<template>
	<div id="app">
		<LoadingScreen v-if="showLoader" :stage="loaderStage" :language="selectedLanguage" />
		<Header :language="selectedLanguage" @change-language="updateLanguage" @change-theme="updateTheme" @change-city="updateCity" />
		<main class="main-content">
			<CurrentForecast v-if="current.temperature !== null" :temperature="round(current.temperature)" :now="now" :language="selectedLanguage" :weather-code="current.weather_code" />
			<CurrentForecastDetails v-if="daily.length > 0" :sunrise="convertSunriseTime" :sunset="convertSunsetTime" :visibility="convertVisibility" :min-pressure="convertMinPressure" :max-pressure="convertMaxPressure" :language="selectedLanguage" />
			<div class="forecast-container">
				<div class="hourly-forecast">
					<div class="forecast-title">{{ currentTranslations.HourlyForecast }}</div>
					<div class="hourly-scroll-container" ref="scrollContainer">
						<HourlyCard v-for="(hour, index) in hourlyForecast" :key="index" :time="hour.time" :temperature="hour.temperature" :weather-code="hour.weatherCode" :language="selectedLanguage" />
					</div>
				</div>

				<div class="daily-forecast">
					<div class="forecast-title">{{ currentTranslations.DailyForecast }}</div>
					<div class="dailyContainer">
						<DailyCard v-for="(day, index) in translatedDailyCards" :key="index" :date="day.time" :temp-max="day.temperature" :temp-min="day.feelsLike" :weather-code="day.weatherCode" :language="selectedLanguage" />
					</div>
				</div>
			</div>
		</main>
		<Footer />
	</div>
</template>

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
import pinia from './store/index.js'
import LoadingScreen from './components/LoadingScreen.vue'
import { useUserStore } from './store/userStore'

import Footer from './components/Footer.vue'
import SimpleDynamicBackground from './components/SimpleDynamicBackground.vue'

gsap.registerPlugin(ScrollToPlugin)

export default {
	components: {
		CurrentForecast,
		Header,
		CurrentForecastDetails,
		DailyCard,
		HourlyCard,
		LoadingScreen,
		SimpleDynamicBackground,
		Footer,
	},
	data() {
		return {
			currentCity: 'London',
			cities: ['Paris', 'New York', 'Tokyo', 'Moscow', 'Berlin'],

			selectedLanguage: 'Русский',
			selectedTheme: 'Светлая',

			temperature: 23,
			now: 'Now',
			dailyCards: [
				{
					time: Date.now() / 1000 + 86400,
					temperature: 23,
					feelsLike: 19,
					weatherCode: 1,
				},
				{
					time: Date.now() / 1000 + 2 * 86400,
					temperature: 25,
					feelsLike: 20,
					weatherCode: 2,
				},
				{
					time: Date.now() / 1000 + 3 * 86400,
					temperature: 25,
					feelsLike: 20,
					weatherCode: 2,
				},
				{
					time: Date.now() / 1000 + 4 * 86400,
					temperature: 25,
					feelsLike: 20,
					weatherCode: 2,
				},
				{
					time: Date.now() / 1000 + 5 * 86400,
					temperature: 25,
					feelsLike: 20,
					weatherCode: 2,
				},
				{
					time: Date.now() / 1000 + 6 * 86400,
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
		console.log('[APP] Загружаем тему из localStorage:', savedTheme)
		if (savedTheme) {
			this.selectedTheme = savedTheme
			this.applyTheme(savedTheme)
		} else {
			console.log('[APP] Тема не найдена в localStorage, используем по умолчанию:', this.selectedTheme)
		}

		const browserLanguage = navigator.language.split('-')[0]
		console.log('[APP] Язык браузера:', browserLanguage)

		const languageMap = {
			ru: 'Русский',
			en: 'English',
		}

		const mappedLanguage = languageMap[browserLanguage]
		if (mappedLanguage && language[mappedLanguage]) {
			this.selectedLanguage = mappedLanguage
			console.log('[APP] Установлен язык из браузера:', mappedLanguage)
		} else {
			this.selectedLanguage = 'English'
			console.log('[APP] Язык браузера не поддерживается, установлен English по умолчанию')
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
		gsap.from('.header-container, .CurrentForecast, .CurrentForecastDetails, .hourly-scroll-container, .dailyContainer, .footer, .line-img', {
			opacity: 0,
			y: 30,
			duration: 2,
			ease: 'power3.out',
			stagger: 0.3,
			delay: 0.3,
		})
	},
	methods: {
		async fetchData() {
			const serverStore = useServerStore()
			this.showLoader = true
			this.loaderStage = 'fetching'
			try {
				this.loaderStage = 'requesting'
				let userPos
				try {
					userPos = await apiLocation.getCoordinatesByCity(this.currentCity)
					if (!userPos) throw new Error('Город не найден')
					DataService.addPosToStore(userPos.lat, userPos.long)
				} catch (err) {
					console.warn('[APP] Город не найден, используем позицию браузера')
					userPos = await apiBrowser.getPos()
					DataService.addPosToStore(userPos.lat, userPos.long)
					this.currentCity = await apiLocation.getCityNameByStore()
				}

				await apiForecast.fetchForecast()
				this.loaderStage = 'showing'
				const data = DataService.getAllData()
				this.units = data.units
				this.current = data.current
				this.daily = data.daily
				this.applyTheme(this.selectedTheme)
				this.$nextTick(() => {
					this.waitUntilAllLoaded()

					const timeline = gsap.timeline({ delay: 0 })

					timeline
						.from('.header-container', {
							y: 30,
							opacity: 0,
							duration: 0.8,
							ease: 'power2.out',
						})
						.from('.CurrentForecast', {
							y: 30,
							opacity: 0,
							duration: 0.8,
							ease: 'power2.out',
						}, '-=0.3')
						.from('.CurrentForecastDetails', {
							y: 30,
							opacity: 0,
							duration: 0.8,
							ease: 'power2.out',
						}, '-=0.3')
						.from('.hourly-card', {
							y: 20,
							opacity: 0,
							duration: 0.2,
							stagger: 0.015,
							ease: 'power2.out',
						}, '-=2')
						.from('.hourly-scroll-container', {
							y: 30,
							opacity: 0,
							duration: 0.5,
							ease: 'power2.out',
						}, '-=0.2')
						.from('.forecast-title', {
							y: 30,
							opacity: 0,
							duration: 0.5,
							ease: 'power2.out',
						}, '-=0.2')
						.from('.dailyContainer > *', {
							y: 30,
							opacity: 0,
							duration: 0.5,
							stagger: 0.1,
							ease: 'power2.out',
						}, '-=0.2')
						.from('.footer', {
							y: 30,
							opacity: 0,
							duration: 0.5,
							ease: 'power2.out',
						}, '-=0.2')
						.from('.line-img', {
							y: 30,
							opacity: 0,
							duration: 0.5,
							ease: 'power2.out',
						}, '-=0.6')
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
			const userStore = useUserStore(pinia)
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
			console.log('[APP] Обновляем тему с', this.selectedTheme, 'на', newTheme)
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

			let startX = 0
			let scrollLeft = 0
			let isDragging = false

			const startDrag = e => {
				if (this.isSnapping) return
				isDragging = true
				this.isDragging = true
				container.classList.add('dragging')
				startX = (e.pageX || (e.touches && e.touches[0].pageX)) - container.offsetLeft
				scrollLeft = container.scrollLeft
				gsap.killTweensOf(container)
			}

			const onDrag = e => {
				if (!isDragging) return
				e.preventDefault()
				const x = (e.pageX || (e.touches && e.touches[0].pageX)) - container.offsetLeft
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
							console.log('[APP] Snapped to card', closestCardIndex, 'at scrollLeft:', targetScrollLeft)
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

			this.$once('hook:beforeUnmount', () => {
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
		updateCity(newCity) {
			if (!newCity) return
			this.currentCity = newCity
			console.log('[APP] Обновлён город пользователем:', newCity)
			this.setStore()
			this.fetchData()
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
			return Convert.toVisibilityDesc(this.daily[0]?.visibility, this.selectedLanguage) || 'None'
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

<style>
#app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.main-content {
	flex: 1;
	padding: 20px;
	max-width: 1400px;
	margin: 0 auto;
	width: 100%;
}

.forecast-container {
	display: flex;
	flex-direction: column;
	gap: 30px;
	margin-top: 30px;
}

.forecast-title {
	font-size: 24px;
	font-weight: 700;
	margin-bottom: 20px;
	color: #333;
}

.hourly-scroll-container {
	display: flex;
	gap: 15px;
	overflow-x: auto;
	padding: 10px 0;
	scroll-behavior: smooth;
}

.dailyContainer {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 15px;
}
</style>
