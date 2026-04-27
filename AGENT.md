# AGENT.md

## Что это за проект

`sarmaexpress` - монорепозиторий для сайта и сервисных flow компании:

1. `Сарма Экспресс` - публичная витрина, страницы услуг, калькулятор и карта пунктов выдачи.
2. `SUPERBOX` - прикладной интерфейс для интернет-магазинов, заказов, отслеживания, тарифов и служебных сценариев.

Пользователь работает на русском. Отвечать и фиксировать handoff лучше на русском.

## Важный текущий статус

- Основной GitHub-репозиторий: `https://github.com/Serebubi/sarmaexpress`.
- Открыт draft PR: `https://github.com/Serebubi/sarmaexpress/pull/1`.
- Ветка PR: `codex/calculator-marketplaces-ftl-ltl`.
- Коммиты PR:
  - `09f5211` - основные изменения калькулятора, Superbox, FTL/LTL.
  - следующий коммит после обновления handoff-файлов должен содержать только `AGENT.md`, `CURRENT_STATUS.md`, `PROJECT_CONTEXT.md`, `HANDOFF.md`.
- Рабочая папка пользователя `C:\Users\Dell\Documents\Codex\sarmaexpress-main` не является git-репозиторием.
- Для PR был создан свежий клон: `C:\Users\Dell\Documents\Codex\sarmaexpress-pr-work`.

## Как работать

- Перед новой задачей читать:
  1. `AGENT.md`
  2. `CURRENT_STATUS.md`
  3. `PROJECT_CONTEXT.md`
  4. `HANDOFF.md`
- Не откатывать чужие изменения без явной просьбы.
- Не коммитить локальные Excel, PNG, dev-логи, `.next`, `node_modules`, `storage/data/orders.json` и прочие рабочие артефакты без отдельной просьбы.
- Для UI-задач сначала смотреть `frontend`.
- Для форм и схем смотреть также `shared/src/index.ts`.
- Backend трогать только если меняются формы, API заказов или интеграции.

## Основные маршруты

Публичные страницы:

- `/` - главная `Сарма Экспресс`
- `/sarma-express` - дубль главной
- `/calculator` - калькулятор доставки
- `/pickup-points` - пункты выдачи и карта
- `/ftl` - страница `FTL - Полная загрузка`
- `/ltl` - страница `LTL - Сборные грузы`

`SUPERBOX`:

- `/superbox`
- `/superbox?flow=pickup_paid`
- `/superbox?flow=order_lookup`
- `/superbox?flow=ship_russia`
- `/superbox?flow=tariffs`
- `/superbox?flow=business`
- `/superbox?flow=home_delivery`
- `/superbox?flow=cancel_order`
- `/superbox?flow=support`

## Навигация и карточки услуг

Файл верхнего меню: `frontend/components/sarma-express-header.tsx`.

На главной карточки услуг находятся в `frontend/components/sarma-express-page.tsx`.

Текущие переходы карточек:

- `ЭКСПРЕСС ДОСТАВКА` -> `/superbox?flow=pickup_paid`
- `LTL - СБОРНЫЕ ГРУЗЫ` -> `/ltl`
- `FTL - ПОЛНАЯ ЗАГРУЗКА` -> `/ftl`
- `ДОСТАВКА ИЗ ИНТЕРНЕТ-МАГАЗИНОВ` -> `/superbox?flow=pickup_paid`

## Ключевые файлы

- `frontend/components/delivery-calculator-page.tsx` - калькулятор доставки.
- `frontend/lib/delivery-tariffs.ts` - тарифная модель, города, ограничения ПВЗ/склада.
- `frontend/components/superbox-app.tsx` - сценарии Superbox и маркетплейсы.
- `frontend/components/pickup-points-page.tsx` - страница ПВЗ и карта.
- `frontend/components/sarma-express-page.tsx` - главная и карточки услуг.
- `frontend/components/ftl-page.tsx` - страница FTL.
- `frontend/components/ltl-page.tsx` - страница LTL.
- `shared/src/index.ts` - общие схемы, типы, точки выдачи, валидация форм.
- `backend/src/routes/orders.ts` - обработка новых форм заказов.

## Что важно знать по калькулятору

- В блоках `Откуда` и `Куда` теперь 3 кнопки: `ПВЗ`, `Склад`, `Курьер`.
- Если варианта нет в городе или он недоступен по весу, кнопка неактивна.
- Если вес превышает лимит ПВЗ, а склада в городе нет, автоматически выбирается `Курьер`.
- Москва в маршруте переводит сценарий в заявку/звонок и сообщение про направление от 500 кг.
- Для грузов от 500 кг справа показывается специнформация и CTA `Заполнить заявку` / `Позвонить нам`.
- После расчёта есть кнопка оформления заказа и анкета на этом же экране.
- Поле объёма заменено на `длина`, `ширина`, `высота`.

## Что важно знать по Superbox

- Убраны сценарии `WB опт` и `WB дорогостой`.
- Для OZON и Wildberries в анкетах убраны поля `Количество товаров` и `Итоговая цена всех товаров`.
- Плашка с кнопкой `Продолжить` после выбора маркетплейса фиксируется снизу экрана.
- Пункты выдачи и склады добавлены из локального файла `Новая таблица (1).xlsx` в список выбора и карту.

## Проверки

Перед PR были выполнены:

- `npm run build -w frontend` - проходит.
- `npm run build -w backend` - проходит.

`npm run lint -w frontend` на текущем коде падает не из-за FTL/LTL, а на существующих местах:

- `frontend/components/delivery-calculator-page.tsx:273` - `react-hooks/set-state-in-effect`.
- `frontend/components/superbox-app.tsx:775` - `react-hooks/set-state-in-effect`.
- Также есть несколько warnings по unused-переменным.

После `npm ci` npm показывает audit-предупреждения: `3 moderate`, `4 high`.
