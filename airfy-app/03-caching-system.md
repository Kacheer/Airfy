# Система кеширования данных в Airfy

## Обзор

Система кеширования в Airfy использует многоуровневый подход для оптимизации производительности и экономии трафика:

1. **Памяти приложения** (Runtime cache) — данные хранятся в переменных Pinia во время сеанса
2. **Локального хранилища браузера** (localStorage) — персистентное кэширование между сеансами
3. **API-уровня** (HTTP кэш) — 10-минутный таймер для предотвращения избыточных запросов

## Уровень 1: Runtime Cache (Pinia)

### Как это работает

Состояние хранится в памяти приложения через **Pinia**:

```javascript
// src/store/Serverstore.js
export const useServerStore = defineStore('ServerStore', {
  state: () => ({
    units: { temperature, pressure, wind_speed },
    current: { temperature, weather_code },
    daily: Array(7),    // Ежедневные данные
    lastFetched: null   // Время последней загрузки
  })
})

// src/store/userStore.js
export const useUserStore = defineStore('userStore', {
  state: () => ({
    userPos: { lat, long },    // Координаты пользователя
    city: null,
    language: null,
    requestTime: null
  })
})
```

### Скорость доступа

- ⚡ Практически мгновенный доступ (миллисекунды)
- ✅ Реактивные обновления UI
- ❌ Теряется при перезагрузке страницы

### Структура данных в памяти

```
Serverstore (в памяти)
├── units: { temp: '°C', pressure: 'hPa', wind: 'm/s' }
├── current: { temperature: 12, weather_code: 2 }
├── daily: [
│   ├── [0]: { time, temp, feelsLike, weather_code, hourly: [...] }
│   ├── [1]: { time, temp, feelsLike, weather_code, hourly: [...] }
│   └── ...
│   └── [6]: { time, temp, feelsLike, weather_code, hourly: [...] }
│   ]
└── lastFetched: 1703000000000
```

---

## Уровень 2: localStorage (Persistent Cache)

### Как это работает

**pinia-plugin-persistedstate** автоматически сохраняет состояние в localStorage:

```javascript
// src/store/index.js
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Каждое хранилище с persist: true сохраняется в localStorage
```

### Автоматическое сохранение

Когда состояние изменяется, плагин автоматически сохраняет его:

```javascript
// В Serverstore.js и userStore.js
persist: true  // Включает автоматическое сохранение в localStorage

// Это означает:
// 1. При каждом изменении состояния → сохранение в localStorage
// 2. При загрузке приложения → восстановление из localStorage
```

### Структура в localStorage

```javascript
// localStorage ключи:
{
  "serverStore": {
    "units": { "temperature": "°C", ... },
    "current": { "temperature": 12, "weather_code": 2 },
    "daily": [...],
    "lastFetched": 1703000000000
  },
  "userStore": {
    "userPos": { "lat": 55.7558, "long": 37.6173 },
    "city": "Moscow",
    "language": "Русский",
    "requestTime": 1703000000000
  }
}
```

### Скорость доступа

- ⏱️ Быстрый доступ (десятки-сотни миллисекунд)
- 💾 Объем: ~100-500 KB в зависимости от количества дней
- ⏳ Сохраняется между сеансами (данные остаются после перезагрузки)
- ⚠️ Лимит браузера: обычно 5-10 MB на домен

### Загрузка из localStorage

При инициализации приложения:

```javascript
// App.vue mounted()
const savedTheme = localStorage.getItem('theme')
// Состояние автоматически восстанавливается из localStorage
```

---

## Уровень 3: API-уровня (10-минутный таймер)

### Как это работает

Перед запросом к Open-Meteo API проверяется время последней загрузки:

```javascript
// src/api/apiForecast.js
async fetchForecast(force = false) {
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000;  // 600000 мс

  // Если данные свежие (< 10 минут) и force=false
  if (!force && serverStore.lastFetched && 
      (now - serverStore.lastFetched < tenMinutes)) {
    console.log("[API] Данные свежие (< 10 минут), загружаем из localStorage");
    serverStore.loadState();  // Восстанавливаем из localStorage
    return;  // Пропускаем API запрос
  }

  // Если данные старые или force=true, делаем запрос
  console.log("[API] Обновляем данные с сервера");
  const response = await api.get('v1/forecast', { params: {...} });
  
  // Сохраняем время запроса для следующей проверки
  serverStore.lastFetched = now;
}
```

### Таблица кэширования

| Сценарий | Действие | Результат |
|----------|----------|-----------|
| Первый запуск | Запрос к API | Новые данные от Open-Meteo |
| < 10 минут после запроса | Проверка кэша | Данные из localStorage |
| > 10 минут после запуска | Проверка кэша | Запрос к API |
| Пользователь нажал обновить | force=true | Принудительный запрос к API |
| Перезагрузка страницы | Recovery | Восстановление из localStorage |

---

## Поток кэширования с примерами

### Сценарий 1: Первый запуск приложения

```
1. App.vue mounted() 
2. DataService.waitForCoordinates() 
3. apiForecast.fetchForecast()
   └─ lastFetched = null → API запрос
4. API Open-Meteo возвращает данные
5. DataService.addResponseToStore(response)
   ├─ Трансформирует данные
   └─ Сохраняет в serverStore
6. persistedstate плагин
   └─ Сохраняет в localStorage: "serverStore"
7. Компоненты отрисовываются с новыми данными
```

**Время**: 1-2 секунды (сетевая задержка + обработка)

### Сценарий 2: Пользователь обновляет страницу через 3 минуты

```
1. App.vue mounted() 
2. persistedstate плагин
   └─ Восстанавливает из localStorage: "serverStore"
3. Pinia восстанавливает состояние в памяти
4. apiForecast.fetchForecast()
   ├─ lastFetched существует
   ├─ now - lastFetched = 180000 мс (3 минуты)
   ├─ 180000 < 600000 (10 минут) ✓
   └─ Берет данные из localStorage
5. Компоненты отрисовываются с кэшированными данными
```

**Время**: < 100 мс (нет сетевой задержки!)

### Сценарий 3: Пользователь обновляет страницу через 15 минут

```
1. App.vue mounted() 
2. persistedstate плагин
   └─ Восстанавливает из localStorage
3. apiForecast.fetchForecast()
   ├─ lastFetched существует
   ├─ now - lastFetched = 900000 мс (15 минут)
   ├─ 900000 > 600000 (10 минут) ✗
   └─ Делает новый API запрос
4. API Open-Meteo возвращает свежие данные
5. DataService.addResponseToStore(response)
6. persistedstate плагин
   └─ Сохраняет новые данные в localStorage
7. Компоненты отрисовываются с новыми данными
```

**Время**: 1-2 секунды (если сетевое соединение медленнее)

---

## Явное управление кэшем

### Сохранение кэша

```javascript
// Явное сохранение в localStorage (редко нужно, так как автоматическое)
serverStore.saveState()

// DataService.js
saveState() {
  localStorage.setItem('serverStore', JSON.stringify(this.$state))
}
```

### Загрузка кэша

```javascript
// Явная загрузка из localStorage
serverStore.loadState()

// DataService.js
loadState() {
  const data = localStorage.getItem('serverStore')
  if (data) {
    Object.assign(this.$state, JSON.parse(data))
    return true
  }
  return false
}
```

### Просмотр кэша в браузере

```javascript
// В консоли браузера (F12):
localStorage.getItem('serverStore')     // Просмотр сохраненных данных
JSON.parse(localStorage.getItem('serverStore'))  // Красивый вывод
localStorage.removeItem('serverStore')  // Удаление кэша
localStorage.clear()                    // Очистка всего localStorage
```

---

## Отладка кэширования

### Логирование в консоли

Все операции кэширования логируются:

```javascript
// При загрузке из кэша:
"[API] Данные свежие (< 10 минут), загружаем из localStorage"

// При запросе к API:
"[API] Обновляем данные с сервера"
"[API] Данные успешно получены: {...}"

// При сохранении в хранилище:
"[STORE] Данные daily обновлены: Array(7)"
"[DS] Модель ежедневных данных собрана!"

// При восстановлении из localStorage:
"[Pinia] Плагин persistedstate подключён"
```

### DevTools для отладки

**Chrome/Edge/Firefox:**
1. Откройте Developer Tools (`F12`)
2. Перейдите на вкладку **Application** (Chrome) или **Storage** (Firefox)
3. В левой колонке выберите **Local Storage**
4. Выберите домен приложения
5. Найдите ключи:
   - `serverStore` — метеорологические данные
   - `userStore` — данные пользователя
   - `theme` — выбранная тема
6. Кликните на ключ для просмотра JSON данных

### Командная строка браузера

```javascript
// Выведет объект с метеорологическими данными
console.log(JSON.parse(localStorage.getItem('serverStore')))

// Выведет время последней загрузки
console.log(JSON.parse(localStorage.getItem('serverStore')).lastFetched)

// Выведет текущее время
console.log(Date.now())

// Вычислит, сколько прошло минут
const last = JSON.parse(localStorage.getItem('serverStore')).lastFetched
const mins = (Date.now() - last) / (60 * 1000)
console.log(`Прошло ${mins.toFixed(1)} минут`)

// Очистит кэш
localStorage.clear()
```

---

## Размер кэша

### Примерное занимаемое место

```
userStore:        ~500 байт
  ├─ userPos:     ~50 байт
  ├─ city:        ~20 байт
  ├─ language:    ~15 байт
  └─ requestTime: ~10 байт

serverStore:      ~100-300 KB
  ├─ units:       ~100 байт
  ├─ current:     ~50 байт
  ├─ daily[7]:    ~50 KB (включая hourly[24] для каждого дня)
  └─ lastFetched: ~13 байт

theme:            ~15 байт

ИТОГО: ~100-300 KB
```

**Браузерные лимиты:**
- Chrome: 10 MB на домен (в большинстве браузеров)
- Firefox: 10 MB на домен
- Safari: 5 MB на домен

Наше приложение использует < 1% браузерного лимита, поэтому нет проблем с объемом.

---

## Сценарии использования кэша

### ✅ Когда кэш полезен

- Пользователь оставляет приложение открытым и возвращается через несколько минут
- Периодическое обновление страницы (F5)
- Переход между вкладками и возврат в приложение
- Ненадежное интернет соединение (кэш сохраняет работоспособность)
- Снижение нагрузки на API сервер (Open-Meteo экономит ресурсы)

### ⚠️ Когда кэш может быть проблемой

- Данные устаревают (решение: кнопка обновления с `force=true`)
- Пользователь переместился в другую локацию (решение: переброс геолокации)
- Критические обновления данных требуют немедленной синхронизации

---

## Оптимизация кэширования в будущем

💡 **Возможные улучшения:**

1. **Адаптивный таймер** — увеличить время кэша для мобильных устройств
2. **Сжатие данных** — использовать gzip для localStorage
3. **Индексированная БД** — миграция на IndexedDB для больших объемов данных
4. **Синхронизация сервера** — сохранение предпочтений пользователя на бэкенде
5. **Версионирование кэша** — обновление кэша при релизе нового приложения
6. **Фоновая синхронизация** — использование Service Workers для обновления данных в фоне

