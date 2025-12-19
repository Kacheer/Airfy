# Руководство по отладке Airfy

Это руководство поможет вам отладить приложение Airfy при возникновении проблем.

## 🔴 Быстрая диагностика проблем

### Проблема: Приложение не загружается

**Симптомы:**
- Пустой экран
- Ошибки в консоли

**Решение:**
1. Откройте консоль (`F12` → **Console**)
2. Проверьте наличие ошибок (красные сообщения)
3. Выполните команду:
   ```javascript
   console.log("[DEBUG] App loaded, checking state...")
   ```
4. Проверьте, загружается ли Pinia:
   ```javascript
   console.log("[DEBUG] Pinia stores:", Object.keys(window.__PINIA__))
   ```

---

### Проблема: Геолокация не работает

**Симптомы:**
- Приложение просит разрешение на геолокацию, но ничего не происходит
- Логи показывают "Ошибка при получении координат"

**Решение:**
1. Проверьте разрешения браузера:
   - Chrome: Адресная строка → 🔒 → Site settings → Location
   - Firefox: Menu → Settings → Privacy → Permissions → Location
2. Проверьте логи в консоли:
   ```javascript
   // В консоли браузера
   console.log("[DEBUG] Browser supports geolocation?", 
               'geolocation' in navigator)
   ```
3. Если разрешение дано, но не работает:
   - Приложение доступно по HTTPS?
   - Проверьте, что сайт поддерживает HTTPS (не работает на localhost через http в некоторых браузерах)

---

### Проблема: Данные не загружаются

**Симптомы:**
- Зависимая загрузка (крутится LoadingScreen)
- Логи "Обновляем данные с сервера", но потом ничего

**Решение:**
1. Проверьте сетевую вкладку (`F12` → **Network**)
2. Найдите запрос к `api.open-meteo.com`
3. Проверьте:
   - **Status**: должен быть 200 (успех)
   - **Response**: должны быть JSON данные
4. Если статус не 200:
   - 4xx = проблема с параметрами запроса
   - 5xx = проблема на сервере Open-Meteo
   - timeout = слишком медленный интернет

---

### Проблема: Данные не обновляются

**Симптомы:**
- Показывают старые данные при каждой загрузке
- "Данные свежие (< 10 минут), загружаем из localStorage"

**Решение:**
1. Проверьте, насколько стары кэшированные данные:
   ```javascript
   // В консоли браузера
   const last = JSON.parse(localStorage.getItem('serverStore')).lastFetched
   const mins = (Date.now() - last) / (60 * 1000)
   console.log(`Последнее обновление: ${mins.toFixed(1)} минут назад`)
   ```
2. Если прошло больше 10 минут, но кэш все еще используется, очистите:
   ```javascript
   localStorage.clear()
   location.reload()
   ```
3. Если нужно принудительное обновление, используйте:
   ```javascript
   // В консоли браузера
   const { useServerStore } = window.__PINIA__
   const store = useServerStore()
   // Вызовите функцию обновления (зависит от реализации)
   ```

---

## 🔧 Инструменты отладки

### 1. Консоль браузера

**Как открыть:**
- Windows/Linux: `F12` или `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`
- Chrome: Menu → More tools → Developer Tools

**Что смотреть:**
```javascript
// Все логи с префиксами [APP], [API], [STORE], [DS]

// Пример нормального потока:
[APP] Загружаем тему из localStorage: dark
[API] Позиция пользователя получена: 55.7558, 37.6173
[API] Обновляем данные с сервера
[DS] Модель ежедневных данных собрана!
[STORE] Данные daily обновлены: Array(7)
```

**Фильтрация логов:**
- Введите в поле фильтра консоли: `[API]` для просмотра только API логов
- Используйте `-` для исключения: `-[APP]` исключит логи приложения

---

### 2. Network вкладка

**Как открыть:** `F12` → **Network**

**Что проверять:**
1. Загрузитесь при открытой Network вкладке
2. Ищите запрос `v1/forecast` к `api.open-meteo.com`
3. Кликните на запрос и проверьте:
   - **Headers**: параметры запроса (latitude, longitude)
   - **Response**: полный JSON ответ
   - **Timing**: сколько времени заняла загрузка

**Анализ проблем:**
- Если нет запроса → приложение использует кэш (это нормально)
- Если запрос медленный (> 1s) → интернет медленный
- Если запрос ошибка → проблема с параметрами или сервером

---

### 3. Application/Storage вкладка

**Как открыть:** 
- Chrome: `F12` → **Application**
- Firefox: `F12` → **Storage**

**Что проверять:**
1. В левой колонке выберите **Local Storage**
2. Выберите домен вашего приложения
3. Найдите ключи:
   - `serverStore` — метеорологические данные
   - `userStore` — данные пользователя
   - `theme` — выбранная тема

4. Кликните на ключ для просмотра JSON

**Отладка кэша:**
```javascript
// Выведет красиво отформатированные данные
console.log(JSON.parse(localStorage.getItem('serverStore')))
```

---

### 4. Vue DevTools расширение

**Установка:**
1. Откройте магазин расширений браузера
2. Поищите "Vue DevTools" или перейдите на [devtools.vuejs.org](https://devtools.vuejs.org/)
3. Установите расширение

**Использование:**
1. Откройте DevTools (`F12`)
2. Найдите вкладку **Vue**
3. Просмотрите:
   - **Components** — дерево компонентов
   - **Stores** (Pinia) — состояние хранилищ в реальном времени
   - Измените значения и смотрите, как меняется UI

---

## 📊 Проверки состояния

### Проверка 1: Геолокация

```javascript
// Выведет координаты пользователя
const { useUserStore } = window.__PINIA__
const store = useUserStore()
console.log("Координаты:", store.userPos)

// Ожидаемый результат:
// { lat: 55.7558, long: 37.6173 }
```

### Проверка 2: Метеорологические данные

```javascript
// Выведет текущую температуру
const { useServerStore } = window.__PINIA__
const store = useServerStore()
console.log("Текущая температура:", store.current.temperature)
console.log("Код погоды:", store.current.weather_code)

// Ожидаемый результат:
// Текущая температура: 12.5
// Код погоды: 2
```

### Проверка 3: Ежедневный прогноз

```javascript
// Выведет прогноз на 7 дней
const { useServerStore } = window.__PINIA__
const store = useServerStore()
console.table(store.daily.map(d => ({
  Дата: new Date(d.time * 1000).toLocaleDateString(),
  Температура: d.temperature,
  'Ощущается как': d.feelsLike,
  'Код погоды': d.weather_code
})))
```

### Проверка 4: Почасовой прогноз

```javascript
// Выведет прогноз на первые 24 часа
const { useServerStore } = window.__PINIA__
const store = useServerStore()
const hourly = store.daily[0].hourly.slice(0, 24)
console.table(hourly.map(h => ({
  Время: new Date(h.time * 1000).toLocaleTimeString(),
  Температура: h.temperature,
  Влажность: h.humidity,
  'Осадки, %': h.precipitation_probability
})))
```

### Проверка 5: Кэш

```javascript
// Выведет информацию о кэше
const last = JSON.parse(localStorage.getItem('serverStore')).lastFetched
const mins = (Date.now() - last) / (60 * 1000)
console.log(`Последнее обновление: ${mins.toFixed(1)} минут назад`)
console.log(`Использовать кэш? ${mins < 10 ? 'Да' : 'Нет'}`)
console.log(`Размер кэша: ${JSON.stringify(localStorage.getItem('serverStore')).length} байт`)
```

---

## 🐛 Частые ошибки и решения

### Ошибка: "Cannot read property 'latitude' of undefined"

**Причина**: Геолокация не получена

**Решение:**
```javascript
// Проверьте, есть ли координаты
console.log(store.userPos.lat)  // Должно быть число, не undefined
```

---

### Ошибка: "lastFetched is not defined"

**Причина**: Первый запуск, кэш пуст

**Решение:** Это нормально, приложение сделает API запрос

---

### Ошибка: "Failed to fetch from api.open-meteo.com"

**Причина**: 
- Нет интернета
- Блокирует CORS
- API сервер недоступен

**Решение:**
1. Проверьте интернет соединение
2. Используйте VPN если блокируется CORS
3. Проверьте [статус Open-Meteo](https://status.open-meteo.com)

---

### Ошибка: "Permission denied for geolocation"

**Причина**: Пользователь отказал в доступе к геолокации

**Решение:**
1. Сбросьте разрешения браузера:
   - Chrome: Settings → Privacy → Site settings → Location → Clear all
2. Перезагрузите приложение
3. Разрешите доступ к геолокации

---

## 📈 Мониторинг производительности

### Скорость загрузки

```javascript
// Измерит время загрузки приложения
console.time('App Load')
// ... код приложения ...
console.timeEnd('App Load')

// Выведет: App Load: 1234ms
```

### Размер переданных данных

```javascript
// Выведет размер API ответа
fetch('https://api.open-meteo.com/v1/forecast?...')
  .then(r => {
    console.log("Размер:", r.headers.get('content-length'), "байт")
    return r.json()
  })
```

### Память, используемая приложением

```javascript
// Chrome DevTools → Performance
// 1. Откройте вкладку Performance
// 2. Нажмите красный круг "Record"
// 3. Используйте приложение
// 4. Нажмите стоп
// 5. Смотрите использование памяти в графике
```

---

## 🧪 Симуляция проблем

### Симуляция медленного интернета

1. Откройте DevTools (`F12`)
2. Перейдите на вкладку **Network**
3. Найдите поле "No throttling"
4. Выберите:
   - **Slow 3G** — очень медленно
   - **Fast 3G** — нормально
   - **Offline** — без интернета

### Симуляция старых данных

```javascript
// Установите время последней загрузки на 20 минут назад
const store = JSON.parse(localStorage.getItem('serverStore'))
store.lastFetched = Date.now() - (20 * 60 * 1000)
localStorage.setItem('serverStore', JSON.stringify(store))
location.reload()
```

### Симуляция отказа в геолокации

```javascript
// В консоли браузера перед первым запуском:
// 1. Откройте DevTools
// 2. Перейдите в Console
// 3. Заблокируйте geolocation:
Object.defineProperty(navigator, 'geolocation', {
  get: () => undefined
})
// Теперь приложение не получит геолокацию
```

---

## 📝 Логирование для отладки

### Добавление своих логов

```javascript
// В любом месте кода добавьте:
console.log("[DEBUG] Мое сообщение об ошибке", variable)

// Выведет:
// [DEBUG] Мое сообщение об ошибке {некоторые данные}
```

### Вывод данных таблицей

```javascript
// Выведет данные красивой таблицей
console.table([
  { name: 'Moscow', temp: 12, humidity: 75 },
  { name: 'London', temp: 8, humidity: 80 }
])
```

### Группировка логов

```javascript
console.group("[API] Запрос к серверу")
  console.log("URL:", url)
  console.log("Параметры:", params)
  console.log("Ответ:", response)
console.groupEnd()
```

---

## 🚨 Экстренные команды

Если приложение не работает, скопируйте и выполните эти команды в консоли:

```javascript
// 1. Полная очистка всего
localStorage.clear()
location.reload()

// 2. Проверить, что осталось
console.log("LocalStorage после очистки:", localStorage.length)

// 3. Проверить Pinia
console.log("Pinia initialized?", !!window.__PINIA__)

// 4. Перезагрузить страницу
location.href = location.href

// 5. Очистить кэш браузера и перезагрузить
// Ctrl+Shift+R (Windows/Linux) или Cmd+Shift+R (Mac)
```

---

## 📞 Если ничего не помогает

1. **Очистите всё:**
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   document.cookie.split(";").forEach(c => 
     document.cookie = c
       .replace(/^ +/, "")
       .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
   )
   location.reload()
   ```

2. **Переустановите зависимости:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

3. **Откройте GitHub Issue:**
   - Напишите подробное описание проблемы
   - Приложите скриншоты консоли
   - Укажите используемый браузер и ОС

---
