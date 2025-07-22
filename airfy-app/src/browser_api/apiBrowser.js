import DataService from "../services/DataService"
import offcetGeo from "../services/offcetGeo"
var userPos = {
    lat: null,
    long: null
}
export default {
    getPos() {
        navigator.geolocation.getCurrentPosition(successHandler, errorHandler)
    }

}

const successHandler = (position) => {
    console.log("Изначальные координаты: ", position.coords.latitude, " and ", position.coords.longitude)
    userPos = offcetGeo._generateRandomOffset(position.coords.latitude, position.coords.longitude, 5)
    console.log(userPos.lat, " and ",userPos.long)
    DataService.addPosToStore(userPos.lat, userPos.long)
}

const errorHandler = (er) => {
    console.log("Ошибка при получении координат", er);
}