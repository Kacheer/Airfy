## 🚀 Запуск и сборка

```bash
npm install          # Установить зависимости
npm run dev          # Запуск на localhost:5173
npm run build        # Сборка для production
npm run preview      # Просмотреть production сборку
```

## 📊 WMO коды погоды

| Код | Описание |
|-----|----------|
| 0 | Ясно |
| 1 | Преимущественно ясно |
| 2 | Облачно |
| 3 | Пасмурно |
| 61-65 | Дождь (легкий-сильный) |
| 71-75 | Снег (легкий-сильный) |
| 95-99 | Гроза |

---

## 🔄 Жизненный цикл данных

```
GPS → userStore → API → DataService → Serverstore → localStorage → UI
```

1. **GPS** — браузер получает координаты
2. **userStore** — сохраняет координаты пользователя
3. **API** — запрашивает прогноз у Open-Meteo
4. **DataService** — трансформирует сырые данные
5. **Serverstore** — сохраняет в Pinia (память)
6. **localStorage** — автосохранение в браузер
7. **UI** — компоненты отображают данные

---

## 🧲 Кэширование

| Уровень | Место | Время жизни |
|---------|-------|-------------|
| 1 | Память (Pinia) | Сеанс |
| 2 | localStorage | До очистки браузера |
| 3 | API таймер | 10 минут |

**10-минутное правило**: Если данные < 10 минут, используется кэш из localStorage.

---

## 🛠️ DevTools

### Chrome/Edge
- **F12** или **Ctrl+Shift+I** → DevTools
- **Application** → Local Storage → смотреть кэш
- **Network** → api.open-meteo.com → смотреть API запросы
- **Console** → смотреть логи

### Firefox
- **F12** или **Ctrl+Shift+K** → DevTools
- **Storage** → Local Storage → смотреть кэш
- **Network** → api.open-meteo.com → смотреть API запросы
- **Console** → смотреть логи

---

## 📝 Префиксы логов

```
[APP]    → События приложения
[API]    → API запросы/ответы
[STORE]  → Операции с хранилищем
[DS]     → DataService операции
```
---

## ⚠️ Частые ошибки

| Ошибка | Решение |
|--------|---------|
| Пусто экран | Откройте консоль (F12), смотрите ошибки |
| Геолокация не работает | Разрешите браузеру доступ к местоположению |
| Старые данные | `localStorage.clear(); location.reload()` |
| Медленно загружается | Проверьте интернет соединение |
| Ошибка 401-502 | Проблема на сервере Open-Meteo, подождите |

---

## 📚 Где найти более подробную информацию

| Тема | Файл |
|------|------|
| Общая структура | [docs/00-quickstart.md](docs/00-quickstart.md) |
| Архитектура | [docs/01-project-architecture.md](docs/01-project-architecture.md) |
| Модули | [docs/02-modules-and-components.md](docs/02-modules-and-components.md) |
| Кэширование | [docs/03-caching-system.md](docs/03-caching-system.md) |
| API | [docs/04-api-integration.md](docs/04-api-integration.md) |
| Отладка | [docs/05-debugging-guide.md](docs/05-debugging-guide.md) |
| Примеры | [docs/06-examples.md](docs/06-examples.md) |

---
