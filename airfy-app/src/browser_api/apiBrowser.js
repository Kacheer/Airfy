
import offcetGeo from "../services/offcetGeo"
export default {
    getPos() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    console.log("Изначальные координаты: ", position.coords.latitude, " and ", position.coords.longitude)
                    const userPos = offcetGeo._generateRandomOffset(
                        position.coords.latitude, 
                        position.coords.longitude, 
                        5
                    )
                    console.log(userPos.lat, " and ", userPos.long)
                    resolve(userPos)
                },
                error => {
                    console.log("Ошибка при получении координат", error)
                    reject(error)
                }
            )
        })
    }
}