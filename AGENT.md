# AGENT.md

## Что это за проект

`sbpsite-main` - монорепозиторий из двух связанных частей:

1. `Сарма Экспресс` - публичная витрина, маркетинговая оболочка и отдельные публичные страницы.
2. `SUPERBOX` - прикладной интерфейс с flow для заказов, отслеживания, тарифов, отправлений по РФ и поддержки.

Текущая задача проекта - постепенно привести важные `SUPERBOX flow` к визуальному стилю `Сарма Экспресс`, не ломая уже работающие сценарии.

## Как работать

- Общаться с пользователем на русском.
- Перед началом нового диалога читать:
  1. `AGENT.md`
  2. `CURRENT_STATUS.md`
  3. `PROJECT_CONTEXT.md`
  4. `HANDOFF.md`
- Не откатывать чужие изменения без явной просьбы.
- Не трогать backend/Bitrix, если задача явно не требует этого.
- Для UI-задач в первую очередь работать во `frontend`, иногда в `shared/src/index.ts`.
- Если пользователь просит "как на главной", использовать общий `SarmaExpressHeader` и синий hero-фон `frontend/public/brand/hero-background.png`.

## Основные маршруты

Публичные страницы:

- `/` - главная `Сарма Экспресс`
- `/sarma-express` - дублирующая главная
- `/calculator` - калькулятор доставки
- `/pickup-points` - пункты выдачи

`SUPERBOX`:

- `/superbox`
- `/superbox?flow=pickup_paid`
- `/superbox?flow=pickup_standard`
- `/superbox?flow=order_lookup`
- `/superbox?flow=ship_russia`
- `/superbox?flow=tariffs`
- `/superbox?flow=business`
- `/superbox?flow=home_delivery`
- `/superbox?flow=cancel_order`
- `/superbox?flow=support`

## Актуальная верхняя навигация

Файл: `frontend/components/sarma-express-header.tsx`

- `Калькулятор` -> `/calculator`
- `Отслеживание` -> `/superbox?flow=order_lookup`
- `Бизнесу` -> `/superbox?flow=business`
- `Тарифы` -> `/superbox?flow=tariffs`
- `Доставка из интернет-магазинов` -> `/superbox?flow=pickup_paid`
- `Отправления в РФ` -> `/superbox?flow=ship_russia`
- `Пункты выдачи` -> `/pickup-points`

## Ключевые файлы

- `frontend/components/sarma-express-header.tsx`
- `frontend/components/sarma-express-page.tsx`
- `frontend/components/delivery-calculator-page.tsx`
- `frontend/components/superbox-app.tsx`
- `frontend/components/pickup-points-page.tsx`
- `frontend/lib/delivery-tariffs.ts`
- `frontend/app/globals.css`
- `shared/src/index.ts`
- `backend/src/routes/orders.ts`
- `backend/src/services/order-service.ts`
- `backend/src/services/bitrix-service.ts`

## Что уже важно знать по UI

- Главная `Сарма Экспресс` живёт на `/`.
- Все 4 карточки блока `Наши услуги` на главной ведут на `/superbox?flow=pickup_paid`.
- Калькулятор на `/calculator` уже не заглушка: в нём есть реальный расчёт по тарифной сетке.
- Отслеживание `order_lookup` теперь ищет только по номеру заказа. По телефону искать нельзя.
- `pickup_paid`, `pickup_standard`, `ship_russia`, `order_lookup`, `tariffs` и `business` уже визуально приведены к Sarma-стилю.

## Практические правила

- Если задача про верхнее меню - начинать с `sarma-express-header.tsx`.
- Если задача про конкретный сценарий `SUPERBOX` - смотреть `superbox-app.tsx`.
- Если задача про калькулятор - смотреть `delivery-calculator-page.tsx` и `frontend/lib/delivery-tariffs.ts`.
- Если задача про ПВЗ - синхронизировать `shared/src/index.ts` и `pickup-points-page.tsx`.
- Если нужна проверка UI, использовать локальную сборку/сервер и по возможности браузерную проверку.

## Осторожно

- В рабочей папке могут быть локальные служебные файлы вроде `.serena/` и локальный Excel `Тарифы Сарма Экспресс.xlsx`; не коммитить их без явной просьбы.
- `shared/dist` может не совпадать с `shared/src`; источником правды считать `shared/src`.
