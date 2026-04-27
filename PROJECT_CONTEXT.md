# PROJECT_CONTEXT.md

## Общий контекст

Проект состоит из:

1. `Сарма Экспресс` - публичная витрина, калькулятор, страницы услуг и карта пунктов выдачи.
2. `SUPERBOX` - приложение для заказов интернет-магазинов, отслеживания, тарифов, доставки по РФ и бизнес-сценариев.

Основная задача последних итераций - привести пользовательские сценарии к единому стилю `Сарма Экспресс` и добавить рабочую логику расчётов/заявок.

## Стек

- Next.js App Router
- React
- TypeScript
- Tailwind
- Shared package для общих схем и типов
- Backend package для заказов и интеграций

## Основные маршруты frontend

- `/`
- `/sarma-express`
- `/calculator`
- `/pickup-points`
- `/superbox`
- `/ftl`
- `/ltl`

## Основные компоненты

- `frontend/components/sarma-express-page.tsx`
- `frontend/components/sarma-express-header.tsx`
- `frontend/components/delivery-calculator-page.tsx`
- `frontend/components/pickup-points-page.tsx`
- `frontend/components/superbox-app.tsx`
- `frontend/components/ftl-page.tsx`
- `frontend/components/ltl-page.tsx`

## Стиль Sarma

Ключевые признаки:

- общий `SarmaExpressHeader`
- hero-фон `frontend/public/brand/hero-background.png`
- синий фон с белыми/светлыми панелями
- насыщенные синие CTA
- тёмно-синий текст
- крупные скругления и мягкие тени

Новые страницы FTL/LTL сделаны в этом стиле.

## Калькулятор

Файлы:

- `frontend/components/delivery-calculator-page.tsx`
- `frontend/lib/delivery-tariffs.ts`
- `shared/src/index.ts`

Логика:

- Расчёт идёт по тарифной модели из Excel.
- Расчётный вес берётся по фактическому весу и габаритам.
- Пользователь выбирает город отправления и назначения.
- Для каждого города есть варианты `ПВЗ`, `Склад`, `Курьер`.
- Наличие и доступность `ПВЗ`/`Склад` зависит от города и лимита веса.
- Если ПВЗ не принимает вес, но склад есть, доступен склад.
- Если ПВЗ не принимает вес и склада нет, автоматически выбирается курьер.
- Москва и вес от 500 кг переводят пользователя к заявке/звонку по спецтарифу.

Таблица порогов из последнего ТЗ:

- Донецк: ПВЗ до 30 кг, выше склад.
- Волноваха: ПВЗ до 100 кг, выше курьер.
- Макеевка: ПВЗ до 15 кг, выше курьер.
- Горловка: ПВЗ до 30 кг, выше склад.
- Мелитополь: ПВЗ до 25 кг, выше курьер.
- Ростов-на-Дону: склад для любого веса.
- Мариуполь: ПВЗ до 50 кг, выше курьер.
- Луганск, Бердянск, Геническ: только курьер.

## Анкеты и заказы

Файлы:

- `frontend/components/delivery-calculator-page.tsx`
- `frontend/components/superbox-app.tsx`
- `shared/src/index.ts`
- `backend/src/routes/orders.ts`

Что есть:

- Анкета после расчёта в калькуляторе.
- Окно телефонов по кнопке `Позвонить нам`.
- Формы FTL/LTL с онлайн-заявкой и консультацией.
- Для OZON/Wildberries убраны поля количества товаров и итоговой цены.

## Пункты выдачи

Файлы:

- `shared/src/index.ts`
- `frontend/components/pickup-points-page.tsx`

Источником последних адресов был локальный файл `Новая таблица (1).xlsx`. В Git добавлены не Excel-файлы, а данные в коде.

Точки используются:

- в выборе пункта выдачи;
- на странице `/pickup-points`;
- в карте.

## FTL

Файлы:

- `frontend/app/ftl/page.tsx`
- `frontend/components/ftl-page.tsx`

Источник: локальный Excel `Страница FTL — Полная загрузка.xlsx`.

Страница содержит:

- hero;
- описание FTL;
- сравнение;
- таблицу транспорта;
- блоки что входит/не входит;
- этапы расчёта ставки;
- форму заявки и консультации;
- условия.

## LTL

Файлы:

- `frontend/app/ltl/page.tsx`
- `frontend/components/ltl-page.tsx`

Источник: локальный Excel `ТЗ_ Страница — Сборные грузы от 500 кг.xlsx`.

Страница содержит:

- hero `Сборные грузы от 500 кг — прямая машина`;
- блок `Почему не калькулятор`;
- сравнение `Прямая машина vs Терминалы`;
- что входит/не входит;
- пример коммерческого предложения;
- форму заявки и консультации;
- условия.

## Проверки и сборка

Основные команды:

- `npm ci`
- `npm run build -w frontend`
- `npm run build -w backend`

Проверено в PR-клоне: frontend/backend build проходят.

`npm run lint -w frontend` пока не является зелёным из-за существующих правил React hooks и unused warnings. Не считать это новой ошибкой FTL/LTL.

## Git workflow

Текущая пользовательская рабочая папка не является git-репозиторием. Для PR используется отдельный клон:

- `C:\Users\Dell\Documents\Codex\sarmaexpress-pr-work`

Открытый PR:

- `https://github.com/Serebubi/sarmaexpress/pull/1`

Ветка:

- `codex/calculator-marketplaces-ftl-ltl`
