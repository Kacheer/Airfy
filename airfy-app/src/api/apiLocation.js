import pinia from '../store/index'
import { useUserStore } from '../store/userStore'
var store = useUserStore(pinia)
export default {
	async getCityName(lat, lon, lang = 'ru') {
		const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${lang}`
		const res = await fetch(url, { headers: { 'User-Agent': 'YourAppName' } })
		const data = await res.json()
		const result =
			data.address?.city ||
			data.address?.town ||
			data.address?.village ||
			data.address?.state ||
			null
		store.$state.city = result
		return store.$state.city
	},
	async getCityNameByStore(lang = 'ru') {
		const url = `https://nominatim.openstreetmap.org/reverse?lat=${store.$state.userPos.lat}&lon=${store.$state.userPos.long}&format=json&accept-language=${lang}`
		const res = await fetch(url, { headers: { 'User-Agent': 'YourAppName' } })
		const data = await res.json()
		const result =
			data.address?.city ||
			data.address?.town ||
			data.address?.village ||
			data.address?.state ||
			null
		store.$state.city = result
		return store.$state.city
	},
	async getCoordinatesByCity(cityName) {
		const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
			cityName
		)}&format=json&limit=1`
		try {
			const res = await fetch(url, { headers: { 'User-Agent': 'YourAppName' } })
			const data = await res.json()
			if (!data || data.length === 0) return null

			const { lat, lon } = data[0]
			store.$state.userPos = {
				lat: parseFloat(lat),
				long: parseFloat(lon),
			}
			return store.$state.userPos
		} catch (error) {
			console.error(
				'[apiLocation] Ошибка при получении координат по названию города:',
				error
			)
			return null
		}
	},
}
