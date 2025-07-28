<template>
	<div class="header-container">
		<span>
			{{ translations.location }}
			<button class="header-button glass-card" lang>
				{{ translations.cities[city] || city }}
			</button></span
		>
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
			</select></span
		>
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
		}
	},
	computed: {
		translations() {
			return language[this.selectedLanguage] || language['Русский']
		},
	},
	methods: {
		updateLanguage() {
			this.$emit('update:language', this.selectedLanguage)
		},
		updateTheme() {
			this.$emit('update:theme', this.selectedTheme)
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
	font-weight: 500;
}
</style>
