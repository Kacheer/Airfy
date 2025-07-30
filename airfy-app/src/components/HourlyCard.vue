<template>
    <div class="glass-card" id="card">
        <p id="hour">{{ convertedTime }}</p>
        <SvgIcon :name="weatherIcon" :width="80" :height="80" :isWeatherIcons="true" />
        <p id="temperature">{{ temperature }} °C</p>
        <p class="feelsLike">{{ feelsLike }} °C</p>
    </div>
</template>

<script>
import SvgIcon from '../../public/SvgIcon.vue';
import Convert from '../services/Convert.js';

export default {
    name: 'HourlyCard',
    components: { SvgIcon },
    props: {
        time: {
            type: Number, // Теперь time — это Unix-время
            required: true,
        },
        temperature: {
            type: Number,
            required: true,
        },
        feelsLike: {
            type: Number,
            required: true,
        },
        weatherCode: {
            type: Number, // Добавлено для погодного кода
            required: true,
        },
        language: { // Добавлено для совместимости с языком
            type: String,
            required: true,
        },
    },
    computed: {
        convertedTime() {
            const time = Convert.toTime(this.time);
  			console.log(`[HOURLY] Converted time for ${this.time}: ${time}`);
  			return time;
        },
        weatherIcon() {
            return Convert.toWeatherIcon(this.weatherCode); // Получаем иконку погоды
        },
    },
};
</script>

<style scoped>
#temperature {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    width: fit-content;
}
.feelsLike {
    font-size: 1.1875rem;
    font-weight: 600;
    text-align: center;
    color: rgba(255, 255, 255, 0.85);
    width: fit-content;
}
p {
    margin: 0;
    padding: 0;
    text-align: center;
    width: fit-content;
}
#card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    gap: 5px;
    width: 223px;
}
#hour {
    font-size: 2rem;
    font-weight: 400;
    text-align: center;
    width: fit-content;
}
</style>