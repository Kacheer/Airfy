# Примеры использования Airfy

Этот документ содержит практические примеры для работы с различными частями приложения Airfy.

## Примеры работы в консоли браузера

Все примеры можно выполнить прямо в консоли браузера (`F12` → **Console**).

---

## 1. Работа с состоянием пользователя

### Получить текущие координаты

```javascript
const { useUserStore } = window.__PINIA__
const store = useUserStore()
console.log("Широта:", store.userPos.lat)
console.log("Долгота:", store.userPos.long)
console.log("Город:", store.city)
console.log("Язык:", store.language)
```

**Ожидаемый результат:**
```
Широта: 55.7558
Долгота: 37.6173
Город: Moscow
Язык: Русский
```

### Установить новый язык

```javascript
const { useUserStore } = window.__PINIA__
const store = useUserStore()
store.language = 'English'  // или другой язык
console.log("Новый язык:", store.language)
```

---

## 2. Работа с метеорологическими данными

### Получить текущую температуру и погоду

```javascript
const { useServerStore } = window.__PINIA__
const store = useServerStore()
console.log("Температура:", store.current.temperature, "°C")
console.log("Код погоды:", store.current.weather_code)

// Декодировать код погоды
const weatherCodes = {
  0: 'Ясно',
  1: 'Преимущественно ясно',
  2: 'Облачно',
  3: 'Пасмурно',
  45: 'Туманно',
  61: 'Легкий дождь',
  63: 'Умеренный дождь',
  65: 'Сильный дождь',
  71: 'Легкий снег',
  95: 'Гроза'
}
console.log("Описание:", weatherCodes[store.current.weather_code])
```

**Ожидаемый результат:**
```
Температура: 12.5 °C
Код погоды: 2
Описание: Облачно
```

---

### Получить ежедневный прогноз

```javascript
const { useServerStore } = window.__PINIA__
const store = useServerStore()

// Показать прогноз на все 7 дней красивой таблицей
console.table(store.daily.map((day, index) => ({
  'День': index + 1,
  'Дата': new Date(day.time * 1000).toLocaleDateString('ru-RU'),
  'Мин температура': '?',  // В данных - только средняя
  'Средняя': day.temperature.toFixed(1) + '°C',
  'Ощущается': day.feelsLike.toFixed(1) + '°C',
  'Влажность': day.humidity + '%',
  'Давление': day.pressure_max + ' hPa'
})))
```

---

### Получить почасовой прогноз на текущий день

```javascript
const { useServerStore } = window.__PINIA__
const store = useServerStore()

// Прогноз на первый день (сегодня)
const today = store.daily[0].hourly

// Показать каждый час
console.table(today.slice(0, 24).map((hour, idx) => ({
  'Час': idx,
  'Время': new Date(hour.time * 1000).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'}),
  'Температура': hour.temperature.toFixed(1) + '°C',
  'Ощущается': hour.apparent_temperature.toFixed(1) + '°C',
  'Влажность': hour.humidity + '%',
  'Осадки, %': hour.precipitation_probability,
  'Видимость': (hour.visibility / 1000).toFixed(1) + ' км'
})))
```

---

## 3. Работа с единицами измерения

### Получить единицы измерения

```javascript
const { useServerStore } = window.__PINIA__
const store = useServerStore()

console.log("Единицы измерения:")
console.log("- Температура:", store.units.temperature)
console.log("- Давление:", store.units.pressure)
console.log("- Скорость ветра:", store.units.wind_speed)
```

**Ожидаемый результат:**
```
Единицы измерения:
- Температура: °C
- Давление: hPa
- Скорость ветра: m/s
```

---

## 4. Работа с кэшем

### Проверить, когда были загружены данные

```javascript
const { useServerStore } = window.__PINIA__
const store = useServerStore()

const lastFetch = new Date(store.lastFetched)
const minutesAgo = (Date.now() - store.lastFetched) / (60 * 1000)

console.log("Последняя загрузка:", lastFetch.toLocaleString('ru-RU'))
console.log("Минут назад:", minutesAgo.toFixed(1))
console.log("Использовать кэш?", minutesAgo < 10 ? 'Да' : 'Нет (нужно обновить)')
```

---

### Просмотреть все данные в localStorage

```javascript
// Выведет все ключи в localStorage
console.log("Ключи в localStorage:", Object.keys(localStorage))

// Выведет размер каждого ключа
Object.keys(localStorage).forEach(key => {
  const size = new Blob([localStorage.getItem(key)]).size
  console.log(`${key}: ${(size / 1024).toFixed(2)} KB`)
})
```

---

### Очистить кэш и перезагрузить

```javascript
// Полная очистка
localStorage.clear()
console.log("Кэш очищен")
location.reload()  // Перезагрузить страницу
```

---

### Скопировать данные о погоде

```javascript
// Полезно для отправки в bug report
const { useServerStore } = window.__PINIA__
const store = useServerStore()

const data = {
  current: store.current,
  daily: store.daily.map(d => ({
    temperature: d.temperature,
    feelsLike: d.feelsLike,
    weather_code: d.weather_code,
    humidity: d.humidity
  })),
  lastFetched: new Date(store.lastFetched).toISOString(),
  localStorage_size: JSON.stringify(localStorage).length
}

console.log(JSON.stringify(data, null, 2))
```

---

## 5. Расширение функциональности

### Конвертировать Цельсий в Фаренгейт

```javascript
function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32
}

const { useServerStore } = window.__PINIA__
const store = useServerStore()

const tempF = celsiusToFahrenheit(store.current.temperature)
console.log("Температура:", store.current.temperature + "°C =", tempF.toFixed(1) + "°F")
```

---

### Конвертировать м/с в км/ч

```javascript
function msToKmh(ms) {
  return ms * 3.6
}

const { useServerStore } = window.__PINIA__
const store = useServerStore()

store.daily.forEach((day, idx) => {
  const windKmh = msToKmh(day.wind_speed)
  console.log(`День ${idx + 1}: ${day.wind_speed} м/с = ${windKmh.toFixed(1)} км/ч`)
})
```

---

### Поиск дня с максимальной температурой

```javascript
const { useServerStore } = window.__PINIA__
const store = useServerStore()

const maxDay = store.daily.reduce((prev, current) => 
  current.temperature > prev.temperature ? current : prev
)

const date = new Date(maxDay.time * 1000)
console.log(`Самый теплый день: ${date.toLocaleDateString('ru-RU')} (${maxDay.temperature}°C)`)
```

---

### Найти дни с вероятностью осадков > 50%

```javascript
const { useServerStore } = window.__PINIA__
const store = useServerStore()

const rainyDays = store.daily.filter(day => 
  day.precipitation_probability > 50
)

console.log("Дни с дождями (вероятность > 50%):")
rainyDays.forEach(day => {
  const date = new Date(day.time * 1000)
  console.log(`- ${date.toLocaleDateString('ru-RU')}: ${day.precipitation_probability}%`)
})
```

---

## 6. Статистика и аналитика

### Средняя температура на неделю

```javascript
const { useServerStore } = window.__PINIA__
const store = useServerStore()

const avgTemp = store.daily.reduce((sum, day) => sum + day.temperature, 0) / 7
console.log("Средняя температура на неделю:", avgTemp.toFixed(1) + "°C")
```

---

### Среднее значение влажности

```javascript
const { useServerStore } = window.__PINIA__
const store = useServerStore()

const avgHumidity = store.daily.reduce((sum, day) => sum + day.humidity, 0) / 7
console.log("Средняя влажность на неделю:", avgHumidity.toFixed(0) + "%")
```

---

### Количество ясных/облачных дней

```javascript
const { useServerStore } = window.__PINIA__
const store = useServerStore()

const clearDays = store.daily.filter(d => d.weather_code <= 1).length
const rainyDays = store.daily.filter(d => d.weather_code >= 61 && d.weather_code <= 82).length
const stormyDays = store.daily.filter(d => d.weather_code >= 95).length

console.log(`Ясных дней: ${clearDays}`)
console.log(`Дождливых дней: ${rainyDays}`)
console.log(`Грозовых дней: ${stormyDays}`)
```

---

## 7. Экспорт и импорт данных

### Экспортировать данные в JSON

```javascript
const { useServerStore, useUserStore } = window.__PINIA__
const serverStore = useServerStore()
const userStore = useUserStore()

const exportData = {
  exported: new Date().toISOString(),
  userPosition: userStore.userPos,
  weatherData: {
    current: serverStore.current,
    daily: serverStore.daily,
    units: serverStore.units,
    lastFetched: new Date(serverStore.lastFetched).toISOString()
  }
}

// Скопировать в буфер обмена
const json = JSON.stringify(exportData, null, 2)
console.log(json)
// Или скопировать:
copy(json)
console.log("Данные скопированы в буфер обмена")
```

---

### Сохранить данные в файл

```javascript
const { useServerStore } = window.__PINIA__
const store = useServerStore()

// Создать blob
const data = JSON.stringify(store.$state, null, 2)
const blob = new Blob([data], { type: 'application/json' })

// Создать ссылку для скачивания
const url = window.URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `weather_export_${new Date().toISOString()}.json`
document.body.appendChild(a)
a.click()
window.URL.revokeObjectURL(url)
a.remove()

console.log("Файл скачан!")
```

---

## 8. Отладочные панели

### Вывести всю информацию о состоянии

```javascript
const { useServerStore, useUserStore } = window.__PINIA__
const serverStore = useServerStore()
const userStore = useUserStore()

console.group("📍 ИНФОРМАЦИЯ ОБ ПРИЛОЖЕНИИ")
  console.group("👤 Данные пользователя")
    console.table({
      Широта: userStore.userPos.lat,
      Долгота: userStore.userPos.long,
      Город: userStore.city,
      Язык: userStore.language
    })
  console.groupEnd()
  
  console.group("🌡️ Текущая погода")
    console.table({
      Температура: serverStore.current.temperature + "°C",
      Код: serverStore.current.weather_code,
      Единица: serverStore.units.temperature
    })
  console.groupEnd()
  
  console.group("📊 Статистика")
    console.table({
      'Дней в прогнозе': serverStore.daily.length,
      'Часов в первом дне': serverStore.daily[0].hourly.length,
      'Размер кэша': (JSON.stringify(serverStore.$state).length / 1024).toFixed(2) + ' KB',
      'Минут с обновления': ((Date.now() - serverStore.lastFetched) / (60 * 1000)).toFixed(1)
    })
  console.groupEnd()
console.groupEnd()
```

---

## 9. Полезные функции для копирования

### Копировать и вставлять функции

```javascript
// Функция для конвертации всех температур
window.convertAllTemps = function(fromC = true) {
  const { useServerStore } = window.__PINIA__
  const store = useServerStore()
  
  if (fromC) {
    store.current.temperature = (store.current.temperature * 9/5) + 32
    store.daily.forEach(d => {
      d.temperature = (d.temperature * 9/5) + 32
      d.feelsLike = (d.feelsLike * 9/5) + 32
    })
    store.units.temperature = '°F'
  }
}

// Использование:
convertAllTemps(true)  // Конвертировать в Фаренгейт

// Вернуть обратно:
location.reload()
```

---

## Советы и трюки

### 1. Быстрое обновление данных

```javascript
// Если нужно обновить данные принудительно
localStorage.removeItem('serverStore')
location.reload()
```

### 2. Просмотр логов определенного уровня

```javascript
// Показать только API логи
console.log("%cAPI логи:", "color: blue; font-weight: bold")
// затем используйте фильтр в консоли [API]
```

### 3. Создать временную метку

```javascript
// Отслеживать время выполнения операции
console.time('Загрузка данных')
// ... какой-то код ...
console.timeEnd('Загрузка данных')
// Выведет: Загрузка данных: 1234ms
```

---

## Экспортировать в CSV

```javascript
const { useServerStore } = window.__PINIA__
const store = useServerStore()

// Создать CSV строку
const csv = [
  ['День', 'Дата', 'Температура', 'Ощущается как', 'Влажность', 'Давление'].join(','),
  ...store.daily.map((d, i) => [
    i + 1,
    new Date(d.time * 1000).toLocaleDateString('ru-RU'),
    d.temperature,
    d.feelsLike,
    d.humidity,
    d.pressure_max
  ].join(','))
].join('\n')

console.log(csv)

// Скачать файл
const blob = new Blob([csv], { type: 'text/csv' })
const url = window.URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'weather.csv'
a.click()
```

---
