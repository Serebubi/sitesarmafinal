# PROJECT_CONTEXT.md

## Общий контекст

Проект состоит из:

1. `Сарма Экспресс` - публичная витрина и основная визуальная оболочка.
2. `SUPERBOX` - приложение для заказов, выдачи, отслеживания, тарифов и сервисных flow.

Главная линия работ - перенос важных flow в единый визуальный стиль `Сарма Экспресс` и постепенное добавление реальной логики туда, где раньше были только заглушки.

## Frontend

Стек:

- Next.js App Router
- React
- TypeScript
- Tailwind

Основные маршруты:

- `frontend/app/page.tsx` -> `/`
- `frontend/app/sarma-express/page.tsx` -> `/sarma-express`
- `frontend/app/calculator/page.tsx` -> `/calculator`
- `frontend/app/pickup-points/page.tsx` -> `/pickup-points`
- `frontend/app/superbox/page.tsx` -> `/superbox`

Основные компоненты:

- `frontend/components/sarma-express-page.tsx`
- `frontend/components/sarma-express-header.tsx`
- `frontend/components/delivery-calculator-page.tsx`
- `frontend/components/pickup-points-page.tsx`
- `frontend/components/superbox-app.tsx`
- `frontend/app/globals.css`

## SUPERBOX flow

Поддерживаемые flow:

- `pickup_paid`
- `pickup_standard`
- `order_lookup`
- `home_delivery`
- `ship_russia`
- `cancel_order`
- `support`
- `tariffs`
- `business`

Открытие конкретного экрана:

- `/superbox?flow=<flow_id>`

## Стиль Sarma

Ключевые признаки:

- общий `SarmaExpressHeader`
- синий hero-фон `frontend/public/brand/hero-background.png`
- большие светлые панели
- насыщенные синие CTA
- тёмно-синий текст
- мягкие тени и крупные скругления

Если пользователь просит сделать "как на главной" или "под наш стиль", нужно придерживаться именно этого паттерна.

## Калькулятор

Файлы:

- `frontend/components/delivery-calculator-page.tsx`
- `frontend/lib/delivery-tariffs.ts`

Сейчас калькулятор уже рабочий.

Источник логики:

- локальный Excel `Тарифы Сарма Экспресс.xlsx` у пользователя

Что реализовано:

- тарифные диапазоны веса
- категории груза
- коэффициенты направлений
- сроки маршрутов
- курьерские фиксы
- грузчики
- подъём без лифта
- провоз в лифте
- занос в частном доме
- спецтариф при весе от `500 кг`

Важно:

- в репозитории лежит уже перенесённая структура тарифов, но сам Excel в Git не добавлен;
- формулы руками заново придумывать не надо, если пользователь не менял исходную логику.

## Отслеживание

Файл:

- `frontend/components/superbox-app.tsx`

Текущее правило:

- `order_lookup` ищет только по номеру заказа;
- поиск по номеру телефона специально отключён и убран из интерфейса.

## Пункты выдачи

Файлы:

- `shared/src/index.ts`
- `frontend/components/pickup-points-page.tsx`

Источник адресов:

- `shared/src/index.ts`

Текущий адрес Мариуполя:

- `Мариуполь, улица 60 лет СССР`

## Backend / shared

Backend:

- `backend/src/routes/orders.ts`
- `backend/src/services/order-service.ts`
- `backend/src/services/bitrix-service.ts`

Shared:

- `shared/src/index.ts`

Обычно backend трогать не нужно, если задача чисто про UI или контент.

## Проверки и сборка

Рабочая команда:

- `npm run build -w frontend`

Замечания:

- локально могут быть старые dev-процессы Next;
- для проверки UI можно поднимать отдельный порт, если `3000` уже занят;
- root-level `eslint` может быть нерелевантен, ориентироваться лучше на реальную сборку frontend.
