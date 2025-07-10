<template>
	<div class="header-container">
		<span
			>Локация <button class="header-button">{{ city }}</button></span
		>
		<span
			>Язык <button class="header-button">{{ language }}</button></span
		>
		<span
			>Тема <button class="header-button">{{ theme }}</button></span
		>
	</div>
</template>
<script>
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
}
</script>
<style scoped>
.header-container {
	display: flex;
	justify-content: center;
	gap: 1rem;
	background-color: rgba(255, 255, 255, 0.05);
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
</style>
