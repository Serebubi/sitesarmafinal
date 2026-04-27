# HANDOFF.md

## Короткая передача состояния

Работа по последнему циклу изменений выполнена и отправлена в draft PR:

- `https://github.com/Serebubi/sarmaexpress/pull/1`
- branch: `codex/calculator-marketplaces-ftl-ltl`
- base: `main`
- последний отправленный UI-коммит: `67d0924 Move services into header menu`

Папка `C:\Users\Dell\Documents\Codex\sarmaexpress-main` - рабочая копия пользователя без `.git`.
Папка `C:\Users\Dell\Documents\Codex\sarmaexpress-pr-work` - git-клон, из которого отправлен PR.

## Что вошло в PR

1. Калькулятор:
   - три кнопки выбора типа доставки: `ПВЗ`, `Склад`, `Курьер`;
   - логика доступности по городам и весовым лимитам;
   - автоматический переход на курьера, если ПВЗ перегружен и склада нет;
   - спецсценарий для Москвы;
   - спецсценарий для грузов от 500 кг;
   - кнопки `Заполнить заявку` и `Позвонить нам`;
   - анкета заявки после расчёта;
   - поля габаритов вместо одного поля объёма.

2. Пункты выдачи:
   - добавлены адреса и графики из `Новая таблица (1).xlsx`;
   - данные подключены к выбору ПВЗ и карте.

3. Superbox:
   - удалены `WB опт` и `WB дорогостой`;
   - исправлен пробел в сетке маркетплейсов;
   - кнопка `Продолжить` фиксируется снизу;
   - для OZON/Wildberries убраны поля `Количество товаров` и `Итоговая цена всех товаров`.

4. Страницы услуг:
   - добавлена `/ftl` по Excel `Страница FTL — Полная загрузка.xlsx`;
   - добавлена `/ltl` по Excel `ТЗ_ Страница — Сборные грузы от 500 кг.xlsx`;
   - блок `Наши услуги:` убран с главной;
   - услуги перенесены в выпадающий пункт верхнего меню `Услуги`;
   - в меню `Услуги` есть переходы на доставку из интернет-магазинов, отправления в РФ, LTL и FTL;
   - на `/ftl` и `/ltl` пункт `Услуги` подсвечивается активным.

5. Правки FTL/LTL после визуальной проверки:
   - в LTL блок `Образец КП` вынесен в отдельную тёмно-синюю секцию ниже сравнения;
   - из LTL-сравнения убрана строка `Грузчики`;
   - из LTL и FTL блока `Что не входит по умолчанию` убран пункт `Грузчики - найдём под запрос`;
   - в LTL и FTL блоке `Что не входит по умолчанию` есть пункт `Простой сверх нормы - по договору`.

6. Shared/backend:
   - обновлены схемы форм в `shared/src/index.ts`;
   - обновлена обработка заказов в `backend/src/routes/orders.ts`.

## Файлы, которые смотреть первыми

- `frontend/components/delivery-calculator-page.tsx`
- `frontend/lib/delivery-tariffs.ts`
- `frontend/components/superbox-app.tsx`
- `frontend/components/pickup-points-page.tsx`
- `frontend/components/sarma-express-page.tsx`
- `frontend/components/ftl-page.tsx`
- `frontend/components/ltl-page.tsx`
- `shared/src/index.ts`
- `backend/src/routes/orders.ts`

## Проверки

В PR-клоне выполнено:

- `npm ci`
- `npm run build -w frontend`
- `npm run build -w backend`
- после правок меню и FTL/LTL повторно выполнен `npm run build -w frontend`

Результат: сборки проходят.

Известные замечания:

- `npm ci` показывает audit warnings: `3 moderate`, `4 high`.
- `npm run lint -w frontend` падает на существующих местах:
  - `delivery-calculator-page.tsx:273`
  - `superbox-app.tsx:775`
- Это lint-ошибки по `setState` внутри `useEffect`, не production build blocker.

## Если нужно продолжать PR

1. Открыть `C:\Users\Dell\Documents\Codex\sarmaexpress-pr-work`.
2. Проверить ветку:
   - `git status -sb`
   - должно быть `codex/calculator-marketplaces-ftl-ltl`.
3. Вносить изменения, коммитить и пушить в эту же ветку.
4. PR обновится автоматически.

## Если нужно работать в пользовательской папке

1. Открыть `C:\Users\Dell\Documents\Codex\sarmaexpress-main`.
2. Помнить, что там нет `.git`.
3. После правок переносить нужные файлы в `sarmaexpress-pr-work`, если изменения должны попасть в PR.

## Не коммитить без просьбы

- локальные Excel-файлы;
- PNG/скриншоты из корня;
- `frontend-start-*.log`;
- `node_modules`;
- `.next`;
- `storage/data/orders.json`, если пользователь отдельно не просит сохранить тестовые заказы.
