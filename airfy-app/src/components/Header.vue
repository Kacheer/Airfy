<template>
	<div class="header-container">
		<span>
			{{ translations.location }}
			<button class="header-button" lang>
				{{ translations.cities[city] || city }}
			</button></span
		>
		<span>
			{{ translations.language }}

			<select
				class="dropdown"
				v-model="selectedLanguage"
				@change="updateLanguage"
			>
				<option v-for="lang in languages" :key="lang" :value="lang">
					{{ translations.languageNames[lang] || lang }}
				</option>
			</select></span
		>
		<span
			>{{ translations.theme }}
			<button class="header-button">
				{{ translations.themes[theme] || theme }}
			</button></span
		>
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
			required: true,
		},
	},
	data() {
		return {
			selectedLanguage: 'Русский',
			languages: ['Русский', 'English'],
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
	},
}
</script>
<style scoped>
.header-container {
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-top: -100px;
	padding: 1rem;
	border-radius: 10px;
	font-weight: bold;
}
.header-button {
	background-color: #444;
	border: none;
	border-radius: 16px;
	padding: 4px 12px;
	color: white;
	font-weight: 500;
	margin-left: 0.5rem;
}
.dropdown {
	background-color: #444;
	color: white;
	border: none;
	border-radius: 16px;
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
