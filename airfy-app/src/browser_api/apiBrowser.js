export default {
    async getPos() {
        getCurrentPosition();
    }
}

const getCurrentPosition = () =>  {
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);

}

const successHandler = (position) =>  {
    console.log("Тебя задианонили :3");
    console.log("Широта: ",position.coords.latitude);
    console.log("Долгота: ",position.coords.longitude);
    // Потом данные в хранилище уйдут

}

const errorHandler = (er) =>  {
    console.log("Ошибка при получении координат");
    console.log(er.code);
    console.log(er.message);
}
    // пока такая заглушка будет