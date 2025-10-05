<template>
	<div
		v-if="icon"
		class="svg-icon"
		v-html="icon"
		:style="containerStyle"
	/>
</template>

<script>
export default {
	name: 'SvgIcon',
	props: {
		name: {
			type: String,
			required: true,
		},
		width: {
			type: [String, Number],
			default: 32,
		},
		height: {
			type: [String, Number],
			default: 32,
		},
		isWeatherIcons: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			icon: null,
		}
	},
	computed: {
		containerStyle() {
			return {
				width: typeof this.width === 'number' ? this.width + 'px' : this.width,
				height: typeof this.height === 'number' ? this.height + 'px' : this.height,
			}
		}
	},
	async created() {
		await this.loadIcon()
	},
	watch: {
		name: {
			handler() {
				this.loadIcon()
			},
			immediate: false
		}
	},
	methods: {
		async loadIcon() {
			try {
				let response;
				if (!this.isWeatherIcons) {
					response = await fetch(`/src/assets/${this.name}.svg`)
				}
				else {
					// Всегда добавляем .svg для weather-icons
					const iconName = this.name.endsWith('.svg') ? this.name : this.name + '.svg';
					console.log('[SvgIcon] Загружаем иконку погоды:', iconName)
					response = await fetch(`/src/assets/weather-icons/${iconName}`)
				}
				console.log('[SvgIcon] Результат загрузки:', response.status, response.url)
				if (!response.ok) throw new Error('Failed to fetch SVG')
				const svgText = await response.text()
				this.icon = svgText
			} catch (error) {
				console.error(`[SvgIcon] Иконка "${this.name}" не найдена.`, error)
			}
		}
	},
}
</script>

<style scoped>
li svg {
	width: 24px;
	height: 24px;
	flex-shrink: 0;
	filter: none;
}
.svg-icon {

	width: 24px;
	height: 24px;


	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	transform: none;
	filter: none;
}
</style>
