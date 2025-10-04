<template>
	<div class="header-container">
		<div class="city-autocomplete" ref="cityAutocomplete">
			{{ translations.location }}
			<input
				ref="cityInput"
				class="header-button glass-card city-input"
				v-model="cityInput"
				@input="onInput"
				@keydown.enter.prevent="handleEnter"
				:placeholder="city"
				autocomplete="off"
			/>
			<ul v-if="suggestions.length" class="suggestions">
				<li
					v-for="(suggestion, index) in suggestions"
					:key="index"
					@click="selectSuggestion(suggestion.fullName)"
				>
					<img
						src="/src/assets/weather-icons/map-marker.svg"
						alt="Location Icon"
					/>
					{{ suggestion.shortName }}
				</li>
			</ul>
		</div>

		<span>
			{{ translations.language }}
			<select
				class="dropdown glass-card header-button"
				v-model="selectedLanguage"
				@change="updateLanguage"
			>
				<option v-for="lang in languages" :key="lang" :value="lang">
					{{ translations.languageNames[lang] || lang }}
				</option>
			</select>
		</span>

		<span>
			{{ translations.theme }}
			<select
				class="dropdown glass-card header-button"
				v-model="selectedTheme"
				@change="updateTheme"
			>
				<option
					v-for="(translatedName, key) in translations.themes"
					:key="key"
					:value="key"
				>
					{{ translatedName }}
				</option>
			</select>
		</span>
	</div>
</template>

<script>
import language from '../lang/language.js'

export default {
	name: 'Header',

	props: {
		city: {
			type: String,
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
		theme: {
			type: String,
			default: 'Темная',
		},
	},

	data() {
		return {
			selectedLanguage: this.language,
			languages: ['Русский', 'English'],
			selectedTheme: this.theme,
			cityInput: this.city,
			suggestions: [],
			debounceTimeout: null,
			handleClickOutsideBound: null,
		}
	},

	computed: {
		translations() {
			return language[this.selectedLanguage] || language['Русский']
		},
	},
	mounted() {
		this.handleClickOutsideBound = event => {
			const autocomplete = this.$refs.cityAutocomplete
			if (!autocomplete) return

			let node = event.target
			let isInside = false
			while (node) {
				if (node === autocomplete) {
					isInside = true
					break
				}
				node = node.parentNode
			}
			if (!isInside) {
				this.suggestions = []
			}
		}

		window.addEventListener('click', this.handleClickOutsideBound)
	},
	beforeUnmount() {
		window.removeEventListener('click', this.handleClickOutsideBound)
	},

	methods: {
		handleClickOutside(event) {
			const autocomplete = this.$refs.cityAutocomplete
			if (autocomplete && !autocomplete.contains(event.target)) {
				this.suggestions = []
			}
		},
		updateLanguage() {
			this.$emit('update:language', this.selectedLanguage)
		},
		updateTheme() {
			this.$emit('update:theme', this.selectedTheme)
		},
		updateCity() {
			if (this.cityInput.trim()) {
				this.$emit('update:city', this.cityInput.trim())
				this.suggestions = []
			}
		},
		async fetchSuggestions(query) {
			if (!query) {
				this.suggestions = []
				return
			}

			const lang = this.selectedLanguage === 'English' ? 'en' : 'ru'
			const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&accept-language=${lang}&q=${encodeURIComponent(
				query
			)}`

			try {
				const response = await fetch(url)
				const data = await response.json()
				this.suggestions = data.map(place => {
					const parts = place.display_name.split(',').map(s => s.trim())
					const shortName = parts.slice(0, 3).join(', ')
					return {
						fullName: place.display_name,
						shortName,
					}
				})
			} catch (err) {
				console.error('Ошибка при получении подсказок:', err)
				this.suggestions = []
			}
		},

		onInput() {
			clearTimeout(this.debounceTimeout)
			this.debounceTimeout = setTimeout(() => {
				this.fetchSuggestions(this.cityInput)
			}, 300)
		},

		selectSuggestion(fullName) {
			this.cityInput = fullName
			this.suggestions = []
			this.updateCity()
		},

		handleEnter() {
			if (this.suggestions.length > 0) {
				this.selectSuggestion(this.suggestions[0].fullName)
			} else {
				this.updateCity()
			}
		},
	},
}
</script>

<style scoped>
.header-container {
	width: 100%;
	height: fit-content;
	margin: 50px 0px;
	display: flex;
	justify-content: center;
	gap: 50px;
	border-radius: 10px;
	font-weight: bold;
	position: relative;
}

.header-button {
	background-color: #444;
	border: none;
	border-radius: 8px;
	padding: 4px 12px;
	color: white;
	font-weight: 500;
	margin-left: 0.5rem;
}

.city-input {
	width: 100px;

	background-color: #444;
	border: none;
	border-radius: 8px;
	padding: 4px 12px;
	color: white;
	font-weight: 500;
	font-size: 1rem;
	line-height: 1.5;
}

.city-input:hover,
.city-input:focus {
	width: 300px;
	transition: width 0.3s ease;
}

.city-input:not(:hover):not(:focus) {
	width: 100px;
	transition: width 0.3s ease;
	color: #f1f1f1;
}

.dropdown {
	background-color: #444;
	color: white;
	border: none;
	border-radius: 8px;
	padding: 4px 12px;
	margin-left: 0.5rem;
	font-weight: 500;
	vertical-align: middle;
	font-size: 1rem;
	line-height: 1.5;
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	text-align: center;
	cursor: pointer;
	position: relative;
}

.city-autocomplete {
	position: relative;
	display: inline-block;
}
.suggestions {
	position: absolute;
	top: 100%;
	left: 0;
	width: 500px;
	max-height: 300px;
	overflow-y: auto;
	background-color: rgba(31, 31, 31, 0.2);
	border: 1px solid #555;
	border-radius: 0 0 8px 8px;
	margin: 0;
	padding: 0;
	list-style: none;
	z-index: 9999;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.suggestions li {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 12px;
	cursor: pointer;
	color: white;
	font-size: 1rem;
	white-space: normal;
	border-bottom: 1px solid #444;
}

.suggestions li img {
	width: 24px;
	height: 24px;
	object-fit: contain;
}

.suggestions li:hover {
	background-color: #555;
}
</style>
