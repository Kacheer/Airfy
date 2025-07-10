<template>
	<div v-if="icon" class="svg-icon" v-html="icon" />
</template>

<script>
export default {
	name: 'SvgIcon',
	props: {
		name: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			icon: null,
		}
	},
	async created() {
		try {
			const response = await fetch(`/src/assets/${this.name}.svg`)
			if (!response.ok) throw new Error('Failed to fetch SVG')
			const svgText = await response.text()
			this.icon = svgText
		} catch (error) {
			console.error(`SVG Icon "${this.name}" not found.`, error)
		}
	},
}
</script>

<style scoped>
li svg {
	width: 32px;
	height: 32px;
	display: block;
	flex-shrink: 0;
}
.svg-icon {
	width: 36px;
	height: 32px;
	display: block;
	object-fit: contain;
}
</style>
