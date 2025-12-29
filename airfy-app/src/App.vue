<template>
	<div id="app">
		<LoadingScreen v-if="showLoader" :stage="loaderStage" :language="selectedLanguage" />
		
		<Header 
			:language="selectedLanguage" 
			:city="currentCity"
			@change-language="updateLanguage"
			@change-theme="updateTheme"
			@change-city="updateCity"
		/>

		<main class="main-content">
			<CurrentForecast
				v-if="current.temperature !== null"
				:temperature="round(current.temperature)"
				:now="now"
				:language="selectedLanguage"
				:weather-code="current.weather_code"
			/>

			<CurrentForecastDetails
				v-if="daily.length > 0"
				:sunrise="convertSunriseTime"
				:sunset="convertSunsetTime"
				:visibility="convertVisibility"
				:min-pressure="convertMinPressure"
				:max-pressure="convertMaxPressure"
				:language="selectedLanguage"
			/>

			<div class="forecast-container">
				<div class="hourly-forecast">
					<div class="forecast-title">{{ currentTranslations.HourlyForecast }}</div>
					<div class="hourly-scroll-container" ref="scrollContainer">
						<HourlyCard
							v-for="(hour, index) in hourlyForecast"
							:key="index"
							:time="hour.time"
							:temperature="hour.temperature"
							:weather-code="hour.weatherCode"
							:language="selectedLanguage"
						/>
					</div>
				</div>

				<div class="daily-forecast">
					<div class="forecast-title">{{ currentTranslations.DailyForecast }}</div>
					<div class="dailyContainer">
						<DailyCard
							v-for="(day, index) in translatedDailyCards"
							:key="index"
							:date="day.time"
							:temp-max="day.temperature"
							:temp-min="day.feelsLike"
							:weather-code="day.weatherCode"
							:language="selectedLanguage"
						/>
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
			selectedLanguage: 'English',
			selectedTheme: 'Светлая',

			temperature: 23,
			now: 'Now',
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

		const browserLanguage = navigator.language.split('-')[0]
		const languageMap = {
			ru: 'Русский',
			en: 'English',
		}

		const mappedLanguage = languageMap[browserLanguage]
		if (mappedLanguage && language[mappedLanguage]) {
			this.selectedLanguage = mappedLanguage
		} else {
			this.selectedLanguage = 'English'
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
				this.animateOnLoad()
			})
		}

		this.fetchData()

		setInterval(() => {
			this.fetchData()
		}, 10 * 60 * 1000)

		this.initScrollableSnap()
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
					if (!userPos) throw new Error('City not found')
					DataService.addPosToStore(userPos.lat, userPos.long)
				} catch (err) {
					console.warn('[APP] City not found, using browser position')
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
					this.animateOnLoad()
				})
			} catch (error) {
				console.error('[APP] Error:', error)
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
					this.animateOnLoad()
				})
			}
		},
		updateLanguage(newLang) {
			this.selectedLanguage = newLang
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
		updateCity(newCity) {
			if (!newCity) return
			this.currentCity = newCity
			const userStore = useUserStore(pinia)
			userStore.setUserPos(null, null)
			this.fetchData()
		},
		round(number) {
			return Math.round(number)
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
				startX = (e.pageX || (e.touches?.[0].pageX)) - container.offsetLeft
				scrollLeft = container.scrollLeft
				gsap.killTweensOf(container)
			}

			const onDrag = e => {
				if (!isDragging) return
				e.preventDefault()
				const x = (e.pageX || (e.touches?.[0].pageX)) - container.offsetLeft
				const walk = (x - startX) * 2
				container.scrollLeft = scrollLeft - walk
			}

			const stopDrag = () => {
				if (!isDragging) return
				isDragging = false
				this.isDragging = false
				this.snapToNearestCard()
			}

			const onScroll = () => {
				if (this.isSnapping || this.isDragging) return
				if (this.scrollTimeout) clearTimeout(this.scrollTimeout)
				this.scrollTimeout = setTimeout(() => {
					this.snapToNearestCard()
				}, 150)
			}

			container.addEventListener('mousedown', startDrag)
			container.addEventListener('mousemove', onDrag)
			container.addEventListener('mouseup', stopDrag)
			container.addEventListener('mouseleave', stopDrag)
			container.addEventListener('touchstart', startDrag)
			container.addEventListener('touchmove', onDrag)
			container.addEventListener('touchend', stopDrag)
			container.addEventListener('scroll', onScroll)
		},
		snapToNearestCard() {
			const container = this.$refs.scrollContainer
			if (!container || this.isSnapping) return

			this.isSnapping = true
			const cards = container.querySelectorAll('.hourly-card')
			if (cards.length === 0) {
				this.isSnapping = false
				return
			}

			const containerRect = container.getBoundingClientRect()
			let closestCard = null
			let minDistance = Infinity

			cards.forEach(card => {
				const cardRect = card.getBoundingClientRect()
				const distance = Math.abs(cardRect.left - containerRect.left)
				if (distance < minDistance) {
					minDistance = distance
					closestCard = card
				}
			})

			if (closestCard) {
				gsap.to(container, {
					scrollLeft: closestCard.offsetLeft,
					duration: 0.3,
					ease: 'power2.out',
					onComplete: () => {
						this.isSnapping = false
					},
				})
			} else {
				this.isSnapping = false
			}
		},
		waitUntilAllLoaded() {
			const images = Array.from(document.images)
			let loaded = 0
			const total = Math.max(images.length, 1)

			if (images.length === 0) {
				this.showLoader = false
				return
			}

			images.forEach(img => {
				if (img.complete) {
					loaded++
				} else {
					img.addEventListener('load', () => {
						loaded++
						if (loaded >= total) {
							setTimeout(() => {
								this.showLoader = false
							}, 200)
						}
					})
					img.addEventListener('error', () => {
						loaded++
						if (loaded >= total) {
							setTimeout(() => {
								this.showLoader = false
							}, 200)
						}
					})
				}
			})

			if (loaded >= total) {
				setTimeout(() => {
					this.showLoader = false
				}, 200)
			}
		},
		animateOnLoad() {
			const timeline = gsap.timeline({ delay: 0 })

			timeline
				.from('.header-container', {
					y: 30,
					opacity: 0,
					duration: 0.6,
					ease: 'power2.out',
				}, 0)
				.from('.CurrentForecast', {
					y: 30,
					opacity: 0,
					duration: 0.6,
					ease: 'power2.out',
				}, 0.1)
				.from('.CurrentForecastDetails', {
					y: 30,
					opacity: 0,
					duration: 0.6,
					ease: 'power2.out',
				}, 0.2)
				.from('.hourly-scroll-container', {
					y: 30,
					opacity: 0,
					duration: 0.6,
					ease: 'power2.out',
				}, 0.3)
				.from('.dailyContainer', {
					y: 30,
					opacity: 0,
					duration: 0.6,
					ease: 'power2.out',
				}, 0.4)
				.from('.footer', {
					y: 30,
					opacity: 0,
					duration: 0.6,
					ease: 'power2.out',
				}, 0.5)
		},
	},
	computed: {
		currentTranslations() {
			return language[this.selectedLanguage] || language['English']
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
	},
}
</script>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	background-color: #ffffff;
	color: #333333;
	font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	transition: background-color 0.3s ease;
}

body.dark-mode {
	background-color: #1a1a1a;
	color: #ffffff;
}

#app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #ffffff;
}

body.dark-mode #app {
	background-color: #1a1a1a;
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
	color: #333333;
}

body.dark-mode .forecast-title {
	color: #ffffff;
}

.hourly-scroll-container {
	display: flex;
	gap: 15px;
	overflow-x: auto;
	padding: 10px 0;
	scroll-behavior: smooth;
}

.hourly-scroll-container::-webkit-scrollbar {
	height: 8px;
}

.hourly-scroll-container::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 10px;
}

.hourly-scroll-container::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 10px;
}

.hourly-scroll-container::-webkit-scrollbar-thumb:hover {
	background: #555;
}

.dailyContainer {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 15px;
}

@media (max-width: 768px) {
	.main-content {
		padding: 10px;
	}

	.forecast-container {
		gap: 20px;
		margin-top: 20px;
	}

	.forecast-title {
		font-size: 20px;
		margin-bottom: 15px;
	}

	.dailyContainer {
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 10px;
	}
}
</style>
