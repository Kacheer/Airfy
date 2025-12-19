# API интеграция в Airfy

## Обзор

Airfy интегрируется с двумя основными API:

1. **Open-Meteo API** — получение метеорологических данных
2. **Браузерное Geolocation API** — получение координат пользователя

## Open-Meteo API

### Что такое Open-Meteo?

**Open-Meteo** — это бесплатный и открытый API для получения прогнозов погоды. Данные получаются из различных метеорологических центров и доступны без регистрации и ограничений по количеству запросов.

**Официальный сайт**: [open-meteo.com](https://open-meteo.com)

### Endpoint и параметры

**URL**: `https://api.open-meteo.com/v1/forecast`

**Метод**: GET

**Параметры запроса:**

```javascript
const params = {
  latitude: 55.7558,                    // Широта
  longitude: 37.6173,                   // Долгота
  
  // Ежедневные параметры (7 дней)
  daily: 'sunrise,sunset,weather_code,temperature_2m_mean,precipitation_probability_mean,relative_humidity_2m_mean,visibility_mean,winddirection_10m_dominant,wind_gusts_10m_mean,cloud_cover_mean,surface_pressure_max,surface_pressure_min',
  
  // Почасовые параметры (168 часов = 7 дней)
  hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,precipitation_probability,wind_speed_10m,pressure_msl,surface_pressure,visibility,uv_index,weather_code',
  
  // Текущие параметры
  current: 'temperature_2m,weather_code',
  
  // Часовой пояс (автоматический = местный часовой пояс)
  timezone: 'auto',
  
  // Формат времени (unixtime = секунды с 1970-01-01)
  timeformat: 'unixtime',
  
  // Единицы измерения скорости ветра
  wind_speed_unit: 'ms'
}
```

### Пример запроса

```javascript
// src/api/apiForecast.js
const response = await axios.get(
  'https://api.open-meteo.com/v1/forecast',
  {
    params: {
      latitude: 55.7558,
      longitude: 37.6173,
      daily: 'sunrise,sunset,weather_code,...',
      hourly: 'temperature_2m,relative_humidity_2m,...',
      current: 'temperature_2m,weather_code',
      timezone: 'auto',
      timeformat: 'unixtime',
      wind_speed_unit: 'ms'
    }
  }
)
```

### Структура ответа

```json
{
  "latitude": 55.7558,
  "longitude": 37.6173,
  "generationtime_ms": 1.5,
  "utc_offset_seconds": 10800,
  "timezone": "Europe/Moscow",
  "timezone_abbreviation": "MSK",
  "elevation": 120,
  
  "current": {
    "temperature_2m": 12.5,
    "weather_code": 2,
    "time": "2024-12-19T10:00"
  },
  
  "daily": {
    "time": [1703001600, 1703088000, ...],
    "sunrise": [1703023200, 1703109600, ...],
    "sunset": [1703055600, 1703142000, ...],
    "weather_code": [2, 3, 1, ...],
    "temperature_2m_mean": [12.1, 14.3, 10.5, ...],
    "precipitation_probability_mean": [10, 20, 5, ...],
    "relative_humidity_2m_mean": [75, 65, 80, ...],
    "visibility_mean": [10000, 9500, 10000, ...],
    "surface_pressure_max": [1025, 1026, 1023, ...],
    "surface_pressure_min": [1015, 1016, 1013, ...],
    "wind_gusts_10m_mean": [3.5, 4.2, 2.1, ...]
  },
  
  "hourly": {
    "time": [1703001600, 1703005200, 1703008800, ...],
    "temperature_2m": [12.5, 12.3, 11.8, ...],
    "relative_humidity_2m": [75, 78, 80, ...],
    "apparent_temperature": [8.5, 8.1, 7.2, ...],
    "precipitation": [0, 0, 0.1, ...],
    "precipitation_probability": [0, 5, 10, ...],
    "visibility": [10000, 10000, 9500, ...],
    "weather_code": [0, 1, 2, ...]
  }
}
```

### WMO коды погоды

Поле `weather_code` содержит WMO (World Meteorological Organization) коды:

| Код | Описание |
|-----|----------|
| 0 | Ясно |
| 1 | Преимущественно ясно |
| 2 | Облачно |
| 3 | Пасмурно |
| 45 | Туманно |
| 48 | Изморозь |
| 51 | Легкая морось |
| 53 | Умеренная морось |
| 55 | Плотная морось |
| 61 | Легкий дождь |
| 63 | Умеренный дождь |
| 65 | Сильный дождь |
| 71 | Легкий снег |
| 73 | Умеренный снег |
| 75 | Сильный снег |
| 80 | Ливни |
| 81 | Сильные ливни |
| 82 | Опасные ливни |
| 85 | Небольшой снег |
| 86 | Сильный снег |
| 95 | Гроза |
| 96 | Гроза с градом |
| 99 | Гроза с сильным градом |

**Использование в приложении:**
```javascript
// src/services/Convert.js (рекомендуется добавить)
const weatherDescriptions = {
  0: 'Ясно',
  1: 'Преимущественно ясно',
  2: 'Облачно',
  3: 'Пасмурно',
  // ... и т.д.
}

function getWeatherDescription(code) {
  return weatherDescriptions[code] || 'Неизвестно'
}
```

---

## Браузерное Geolocation API

### Что такое Geolocation API?

Браузерный API для получения координат устройства пользователя с помощью GPS, вышек сотовой связи и Wi-Fi.

### Запрос геолокации

```javascript
// src/browser_api/apiBrowser.js
navigator.geolocation.getCurrentPosition(
  position => {
    // Успешно получены координаты
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    const accuracy = position.coords.accuracy
  },
  error => {
    // Ошибка при получении координат
    console.error(error.code, error.message)
  },
  options
)
```

### Коды ошибок

| Код | Название | Причина |
|-----|----------|---------|
| 1 | PERMISSION_DENIED | Пользователь отказал в доступе |
| 2 | POSITION_UNAVAILABLE | Координаты недоступны |
| 3 | TIMEOUT | Превышено время ожидания |

### Опции запроса

```javascript
const options = {
  enableHighAccuracy: false,   // false = быстро, true = точно
  timeout: 10000,              // Максимум 10 секунд ожидания
  maximumAge: 300000           // Использовать кэш старше 5 минут? нет
}
```

---

## Поток данных API

### 1️⃣ Получение геолокации

```
App.vue mounted()
  ↓
apiBrowser.getPos()
  ↓
navigator.geolocation.getCurrentPosition()
  ↓
offcetGeo._generateRandomOffset()
  ↓
DataService.addPosToStore(lat, long)
  ↓
userStore.setUserPos()
  ↓
Координаты сохранены в хранилище
```

**Время**: 1-5 секунд (зависит от GPS)

### 2️⃣ Получение прогноза

```
DataService.waitForCoordinates()
  ↓
apiForecast.fetchForecast()
  ↓
Проверка кэша (lastFetched)
  ↓
├─ Если < 10 минут: Данные из localStorage
└─ Если > 10 минут: 
     axios.get('https://api.open-meteo.com/v1/forecast')
       ↓
     DataService.addResponseToStore()
       ↓
     Трансформация данных
       ↓
     serverStore (сохранение)
       ↓
     localStorage (кэш)
```

**Время API**: 200-500 мс

### 3️⃣ Отображение в UI

```
Vue компоненты
  ↓
Получают данные из serverStore (reactively)
  ↓
Преобразование через Convert.js
  ↓
Отрисовка в DOM
  ↓
Динамический фон (SimpleDynamicBackground.vue)
```

**Время**: < 100 мс

---

## Обработка ошибок API

### Ошибки Open-Meteo

```javascript
// apiForecast.js
try {
  const response = await api.get('v1/forecast', { params })
  DataService.addResponseToStore(response)
} catch (error) {
  console.error("[API] Ошибка при получении данных:", error.message)
  
  if (error.response) {
    // Сервер вернул ошибку (4xx, 5xx)
    console.error("Статус:", error.response.status)
    console.error("Данные:", error.response.data)
  } else if (error.request) {
    // Запрос был сделан, но ответа не было
    console.error("Ответа не было")
  } else {
    // Ошибка при формировании запроса
    console.error("Ошибка:", error.message)
  }
}
```

### Ошибки Geolocation

```javascript
// apiBrowser.js
navigator.geolocation.getCurrentPosition(
  position => { /* ... */ },
  error => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.error("Пользователь отказал в доступе к геолокации")
        break
      case error.POSITION_UNAVAILABLE:
        console.error("Координаты недоступны")
        break
      case error.TIMEOUT:
        console.error("Превышено время ожидания геолокации")
        break
    }
  }
)
```

---

## Тестирование API

### 1. Просмотр запросов в браузере

1. Откройте Developer Tools (`F12`)
2. Перейдите на вкладку **Network**
3. Обновите страницу (F5)
4. Найдите запрос к `api.open-meteo.com`
5. Кликните на запрос, чтобы увидеть:
   - **Headers**: параметры запроса
   - **Preview**: структурированный ответ
   - **Response**: полный JSON ответ

### 2. Проверка кэширования

```javascript
// В консоли браузера (F12)

// Выведет время последней загрузки
const lastFetch = JSON.parse(localStorage.getItem('serverStore')).lastFetched
console.log('Последняя загрузка:', new Date(lastFetch))

// Выведет, сколько минут прошло
const mins = (Date.now() - lastFetch) / (60 * 1000)
console.log(`Прошло ${mins.toFixed(1)} минут`)

// Выведет, будет ли использован кэш
console.log('Использовать кэш?', mins < 10)
```

### 3. Тестирование с имитацией сетевых проблем

Chrome DevTools:
1. Откройте **Network** вкладку
2. Найдите выпадающее меню "No throttling"
3. Выберите:
   - **Slow 3G** — 400 кбит/с (медленный интернет)
   - **Fast 3G** — 1.6 мбит/с (нормальный интернет)
   - **Offline** — без интернета (проверит кэш)

### 4. Тестирование без кэша

```javascript
// В консоли браузера (F12):
localStorage.clear()        // Очистить все данные
location.reload()            // Перезагрузить страницу
// Приложение запросит API независимо от времени
```

---

## Примеры использования API

### Пример 1: Получение текущей температуры

```javascript
// apiForecast.js
const response = await api.get('v1/forecast', {
  params: {
    latitude: 55.7558,
    longitude: 37.6173,
    current: 'temperature_2m,weather_code'
  }
})

console.log(response.data.current.temperature_2m)  // → 12.5
console.log(response.data.current.weather_code)    // → 2 (облачно)
```

### Пример 2: Получение прогноза на 7 дней

```javascript
const response = await api.get('v1/forecast', {
  params: {
    latitude: 55.7558,
    longitude: 37.6173,
    daily: 'temperature_2m_mean,weather_code'
  }
})

for (let i = 0; i < 7; i++) {
  console.log(`День ${i+1}: ${response.data.daily.temperature_2m_mean[i]}°C`)
}
```

### Пример 3: Получение почасового прогноза на 24 часа

```javascript
const response = await api.get('v1/forecast', {
  params: {
    latitude: 55.7558,
    longitude: 37.6173,
    hourly: 'temperature_2m,precipitation_probability'
  }
})

// Первые 24 часа
for (let i = 0; i < 24; i++) {
  const temp = response.data.hourly.temperature_2m[i]
  const prob = response.data.hourly.precipitation_probability[i]
  console.log(`${i}:00 — ${temp}°C, вероятность осадков: ${prob}%`)
}
```

---

## Ограничения API

### Open-Meteo

✅ **Преимущества:**
- Бесплатен (без регистрации)
- Нет лимита на количество запросов
- Открытый исходный код
- Точные данные

⚠️ **Ограничения:**
- Не более 1 запроса в секунду на IP (обычно не проблема)
- Данные обновляются каждые 15 минут
- Максимум 7 дней прогноза

### Geolocation API

✅ **Преимущества:**
- Встроен в браузер
- Высокая точность (обычно 50-100 метров)

⚠️ **Ограничения:**
- Требует явного разрешения пользователя
- Доступен только по HTTPS (не по HTTP)
- Может быть медленным на старых устройствах
- Включен не на всех браузерах

---

## Рекомендации для интеграции

### 1. Обработка ошибок

Всегда обрабатывайте ошибки сетевых запросов и geolocation:

```javascript
try {
  await apiBrowser.getPos()
} catch (error) {
  // Fallback: использовать кэшированную последнюю позицию
  const lastPos = DataService.getPosStore()
  if (!lastPos.lat) {
    // Показать ошибку пользователю
    showErrorMessage("Не удалось получить местоположение")
  }
}
```

### 2. Кэширование

Всегда используйте кэширование для экономии трафика:

```javascript
const lastFetch = serverStore.lastFetched
if (lastFetch && Date.now() - lastFetch < 10 * 60 * 1000) {
  return  // Используем кэш
}
```

### 3. Таймауты

Установите таймауты для предотвращения зависания приложения:

```javascript
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000  // 10 секунд
})
```

### 4. Логирование

Логируйте все API операции для отладки:

```javascript
console.log("[API] Запрос к", url)
console.log("[API] Параметры:", params)
console.log("[API] Ответ:", response.data)
```

