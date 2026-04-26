"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { SarmaExpressHeader } from "@/components/sarma-express-header";
import {
  cities,
  courierTariffs,
  getCityLabel,
  getRouteTerm,
  getTariffBand,
  routeCoefficients,
  type CityKey,
  type CourierTariff,
  type TariffBand,
} from "@/lib/delivery-tariffs";

type AddressType = "apartment" | "private";

type CalculatorState = {
  from: CityKey;
  to: CityKey;
  weight: string;
  volume: string;
  addressType: AddressType;
  floor: string;
  hasElevator: boolean;
  needLoaders: boolean;
  privateCarryDistance: string;
};

type CalculationResult =
  | { status: "same-route" | "no-route" }
  | { status: "empty"; coefficient?: number; term?: string }
  | {
      status: "special";
      actualWeight: number;
      volumeWeight: number;
      chargeableWeight: number;
      coefficient: number;
      term: string;
    }
  | {
      status: "ready";
      actualWeight: number;
      volumeWeight: number;
      chargeableWeight: number;
      coefficient: number;
      term: string;
      band: TariffBand;
      courier: CourierTariff;
      transportCost: number;
      courierCost: number;
      loadersCost: number;
      elevatorCost: number;
      stairsCost: number;
      privateCarryCost: number;
      total: number;
    };

type SelectOption<T extends string> = {
  label: string;
  value: T;
};

const cityOptions: Array<SelectOption<CityKey>> = cities.map((city) => ({
  label: city.label,
  value: city.key,
}));

const addressTypeOptions: Array<SelectOption<AddressType>> = [
  { label: "Многоквартирный дом", value: "apartment" },
  { label: "Частный дом", value: "private" },
];

const initialState: CalculatorState = {
  from: "rostov",
  to: "donetsk",
  weight: "",
  volume: "",
  addressType: "apartment",
  floor: "1",
  hasElevator: true,
  needLoaders: false,
  privateCarryDistance: "25",
};

const fieldClassName =
  "calculator-field-input mt-1.5 w-full appearance-none border-none bg-transparent p-0 text-base font-bold text-[#173862] shadow-none outline-none ring-0 placeholder:text-[#8aa2c8] focus:border-none focus:outline-none focus:ring-0 focus-visible:outline-none";

const rubleFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "RUB",
});

const numberFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 1,
});

function parsePositiveNumber(value: string) {
  const normalized = value.replace(",", ".").replace(/\s+/g, "");
  const number = Number(normalized);

  return Number.isFinite(number) && number > 0 ? number : 0;
}

function formatMoney(value: number) {
  return rubleFormatter.format(value).replace(",00", "");
}

export function DeliveryCalculatorPage() {
  const [state, setState] = useState<CalculatorState>(initialState);

  const result = useMemo<CalculationResult>(() => {
    const actualWeight = parsePositiveNumber(state.weight);
    const volume = parsePositiveNumber(state.volume);
    const volumeWeight = volume * 200;
    const chargeableWeight = Math.max(actualWeight, volumeWeight);
    const coefficient = routeCoefficients[state.from][state.to];
    const floor = Math.max(1, Math.floor(parsePositiveNumber(state.floor) || 1));
    const carryDistance = parsePositiveNumber(state.privateCarryDistance);

    if (state.from === state.to) {
      return { status: "same-route" as const };
    }

    if (!coefficient) {
      return { status: "no-route" as const };
    }

    if (!actualWeight && !volume) {
      return {
        status: "empty" as const,
        coefficient,
        term: getRouteTerm(state.from, state.to),
      };
    }

    if (chargeableWeight > 499.9) {
      return {
        status: "special" as const,
        actualWeight,
        volumeWeight,
        chargeableWeight,
        coefficient,
        term: getRouteTerm(state.from, state.to),
      };
    }

    const band = getTariffBand(chargeableWeight);

    if (!band) {
      return { status: "empty" as const, coefficient, term: getRouteTerm(state.from, state.to) };
    }

    const courier = courierTariffs[band.category];
    const extraEligible = band.category !== "Малая" && band.category !== "Стандартная";
    const transportCost = Math.round(band.baseTariff * coefficient);
    const courierCost = courier.fixed;
    const loadersCost = extraEligible && state.needLoaders ? courier.loaders : 0;
    const elevatorCost =
      extraEligible && state.addressType === "apartment" && state.hasElevator && floor >= 2 ? courier.elevatorFee : 0;
    const stairsCost =
      extraEligible && state.addressType === "apartment" && !state.hasElevator && floor >= 2
        ? (floor - 1) * courier.stairPerFloor
        : 0;
    const privateCarryCost =
      state.addressType === "private" && carryDistance > 25 ? Math.ceil((carryDistance - 25) / 10) * 50 : 0;
    const total = transportCost + courierCost + loadersCost + elevatorCost + stairsCost + privateCarryCost;

    return {
      status: "ready" as const,
      actualWeight,
      volumeWeight,
      chargeableWeight,
      coefficient,
      term: getRouteTerm(state.from, state.to),
      band,
      courier,
      transportCost,
      courierCost,
      loadersCost,
      elevatorCost,
      stairsCost,
      privateCarryCost,
      total,
    };
  }, [state]);

  const setField = <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  return (
    <main className="min-h-screen bg-[#edf2f8] text-[#12243f]">
      <SarmaExpressHeader activeItem="calculator" />

      <section
        className="relative overflow-hidden bg-[#4a8de7] bg-cover bg-[position:72%_center] bg-no-repeat"
        style={{ backgroundImage: "url('/brand/hero-background.png')" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(51,114,214,0.96)_0%,rgba(86,148,232,0.82)_34%,rgba(150,198,248,0.26)_64%,rgba(255,255,255,0)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(255,255,255,0.6),transparent_17%),linear-gradient(90deg,rgba(255,255,255,0)_46%,rgba(255,255,255,0.74)_100%)]" />
        <div className="absolute -left-28 top-1/2 h-[580px] w-[580px] -translate-y-1/2 rounded-full border border-white/18" />
        <div className="absolute -left-10 bottom-[-180px] h-[440px] w-[440px] rounded-full border border-white/18" />
        <div className="absolute left-[5%] top-[34%] hidden h-36 w-44 opacity-35 lg:block">
          <DotPattern />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-92px)] w-full max-w-[1320px] gap-8 px-4 py-12 lg:grid-cols-[minmax(0,640px)_minmax(380px,460px)] lg:items-start lg:px-6 lg:py-16">
          <div className="relative z-10 w-full">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/36 bg-white/12 px-4 py-2 text-sm font-semibold text-white/92 backdrop-blur-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#9fd0ff]" />
              Предварительный расчёт
            </div>

            <h1 className="mt-6 max-w-[640px] text-4xl font-extrabold leading-[1.05] text-white drop-shadow-[0_16px_34px_rgba(20,56,120,0.22)] sm:text-5xl lg:text-[4rem]">
              Калькулятор
              <br />
              доставки
            </h1>

            <p className="mt-5 max-w-[560px] text-base leading-7 text-white/88 sm:text-lg">
              Расчёт идёт по тарифной сетке Сарма Экспресс: базовый тариф, коэффициент направления, курьерская доставка,
              грузчики и подъём.
            </p>

            <form
              className="mt-8 rounded-[32px] border border-white/46 bg-[linear-gradient(180deg,rgba(244,249,255,0.3)_0%,rgba(226,238,255,0.2)_100%)] p-5 shadow-[0_28px_80px_rgba(28,78,160,0.24)] backdrop-blur-[20px] sm:p-7"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <div className="grid gap-4">
                <FieldShell icon={<PinIcon />} label="Откуда">
                  <ModernSelect options={cityOptions} value={state.from} onChange={(value) => setField("from", value)} />
                </FieldShell>

                <FieldShell icon={<PinIcon />} label="Куда">
                  <ModernSelect options={cityOptions} value={state.to} onChange={(value) => setField("to", value)} />
                </FieldShell>

                <div className="grid gap-4 md:grid-cols-2">
                  <FieldShell icon={<WeightIcon />} label="Вес груза, кг">
                    <input
                      aria-label="Вес груза, кг"
                      placeholder="Например, 120"
                      inputMode="decimal"
                      value={state.weight}
                      className={fieldClassName}
                      onChange={(event) => setField("weight", event.target.value)}
                    />
                  </FieldShell>

                  <FieldShell icon={<VolumeIcon />} label="Объём, м³">
                    <input
                      aria-label="Объём, м³"
                      placeholder="Например, 1.8"
                      inputMode="decimal"
                      value={state.volume}
                      className={fieldClassName}
                      onChange={(event) => setField("volume", event.target.value)}
                    />
                  </FieldShell>
                </div>

                <FieldShell icon={<HomeIcon />} label="Адрес получателя">
                  <ModernSelect
                    options={addressTypeOptions}
                    value={state.addressType}
                    onChange={(value) => setField("addressType", value)}
                  />
                </FieldShell>

                {state.addressType === "apartment" ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <FieldShell icon={<StairsIcon />} label="Этаж">
                      <input
                        aria-label="Этаж"
                        placeholder="Например, 5"
                        inputMode="numeric"
                        value={state.floor}
                        className={fieldClassName}
                        onChange={(event) => setField("floor", event.target.value)}
                      />
                    </FieldShell>

                    <ToggleField
                      checked={state.hasElevator}
                      icon={<LiftIcon />}
                      label="Лифт"
                      offText="Нет лифта"
                      onText="Есть лифт"
                      onChange={(value) => setField("hasElevator", value)}
                    />
                  </div>
                ) : (
                  <FieldShell icon={<RouteIcon />} label="Занос от парковки, м">
                    <input
                      aria-label="Занос от парковки, м"
                      placeholder="Например, 35"
                      inputMode="decimal"
                      value={state.privateCarryDistance}
                      className={fieldClassName}
                      onChange={(event) => setField("privateCarryDistance", event.target.value)}
                    />
                  </FieldShell>
                )}

                <ToggleField
                  checked={state.needLoaders}
                  icon={<CargoIcon />}
                  label="Грузчики"
                  offText="Не нужны"
                  onText="Нужны"
                  onChange={(value) => setField("needLoaders", value)}
                />

                <button
                  type="submit"
                  className="mt-4 inline-flex min-h-14 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#4f8fe8_0%,#356fcb_100%)] px-8 text-lg font-extrabold text-white shadow-[0_22px_38px_rgba(30,74,156,0.32)] transition hover:-translate-y-0.5"
                >
                  Рассчитать стоимость
                </button>
              </div>
            </form>
          </div>

          <ResultPanel from={state.from} result={result} to={state.to} />
        </div>
      </section>
    </main>
  );
}

function ResultPanel({
  from,
  to,
  result,
}: {
  from: CityKey;
  to: CityKey;
  result: CalculationResult;
}) {
  return (
    <aside className="relative z-10 rounded-[28px] border border-white/58 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(235,244,255,0.92)_100%)] p-5 text-[#173862] shadow-[0_28px_80px_rgba(28,78,160,0.22)] backdrop-blur-[18px] sm:p-6 lg:sticky lg:top-8 lg:mt-[132px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4d78b8]">Итого к оплате</p>
          <h2 className="mt-2 text-4xl font-black text-[#173862]">
            {result.status === "ready" ? formatMoney(result.total) : "—"}
          </h2>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5f0ff] text-[#3f74cb]">
          <ReceiptIcon />
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.86)]">
        <div className="text-sm font-bold text-[#6f87ac]">Маршрут</div>
        <div className="mt-1 text-lg font-black text-[#173862]">
          {getCityLabel(from)} → {getCityLabel(to)}
        </div>
        {"term" in result && result.term ? (
          <div className="mt-2 inline-flex rounded-full bg-[#e8f2ff] px-3 py-1 text-sm font-bold text-[#356fcb]">
            {result.term}
          </div>
        ) : null}
      </div>

      {result.status === "ready" ? (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Metric label="Расчётный вес" value={`${numberFormatter.format(result.chargeableWeight)} кг`} />
            <Metric label="Коэффициент" value={`× ${result.coefficient}`} />
            <Metric label="Категория" value={result.band.category} />
            <Metric label="Тариф" value={result.band.label} />
          </div>

          <div className="mt-5 space-y-3">
            <PriceLine label="Перевозка" value={result.transportCost} />
            <PriceLine label={`Курьерская доставка ${result.courier.destination}`} value={result.courierCost} />
            <PriceLine label="Грузчики" value={result.loadersCost} />
            <PriceLine label="Провоз в лифте" value={result.elevatorCost} />
            <PriceLine label="Подъём пешком" value={result.stairsCost} />
            <PriceLine label="Занос в частном доме" value={result.privateCarryCost} />
          </div>
        </>
      ) : result.status !== "special" ? (
        <ResultMessage status={result.status} />
      ) : null}

      {result.status === "special" ? (
        <div className="mt-5 rounded-2xl border border-[#cfe0f7] bg-white/70 p-4 text-sm font-bold leading-6 text-[#173862]">
          Расчётный вес {numberFormatter.format(result.chargeableWeight)} кг. Для отправлений от 500 кг в тарифной
          таблице указан спецтариф, стоимость нужно согласовать заявкой.
        </div>
      ) : null}
    </aside>
  );
}

function ResultMessage({ status }: { status: "empty" | "same-route" | "no-route" }) {
  const message =
    status === "same-route"
      ? "Выберите разные города отправления и назначения."
      : status === "no-route"
        ? "Для выбранного направления нет коэффициента в тарифной матрице."
        : "Введите вес или объём, чтобы увидеть расчёт.";

  return <div className="mt-5 rounded-2xl bg-white/70 p-4 text-sm font-bold leading-6 text-[#587295]">{message}</div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-3">
      <div className="text-xs font-black uppercase tracking-[0.14em] text-[#7891b5]">{label}</div>
      <div className="mt-1 text-base font-black text-[#173862]">{value}</div>
    </div>
  );
}

function PriceLine({ label, value }: { label: string; value: number }) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#d8e6f8] pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm font-bold text-[#587295]">{label}</span>
      <span className="text-base font-black text-[#173862]">{formatMoney(value)}</span>
    </div>
  );
}

function ModernSelect<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<SelectOption<T>>;
  value: T;
  onChange: (value: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative mt-1.5">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 rounded-[18px] bg-transparent text-left text-base font-bold text-[#173862] outline-none"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="truncate">{selectedOption.label}</span>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d7e5fb] bg-[linear-gradient(180deg,#f8fbff_0%,#ebf3ff_100%)] text-[#3f74cb] shadow-[0_8px_18px_rgba(47,96,184,0.12)] transition ${isOpen ? "rotate-180 border-[#bfd5f7]" : ""}`}
        >
          <ChevronDownIcon />
        </span>
      </button>

      <div
        className={`absolute left-0 right-0 top-[calc(100%+12px)] z-30 origin-top rounded-[22px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(235,244,255,0.94)_100%)] p-2.5 shadow-[0_30px_55px_rgba(24,66,140,0.2)] backdrop-blur-xl transition duration-200 ${isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
      >
        <div className="max-h-64 space-y-1 overflow-y-auto pr-1" role="listbox">
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                className={`flex w-full items-center justify-between gap-3 rounded-[16px] px-4 py-3 text-left transition ${
                  selected
                    ? "bg-[linear-gradient(135deg,#4f8fe8_0%,#3e76cf_100%)] text-white shadow-[0_16px_28px_rgba(46,90,175,0.24)]"
                    : "bg-white/55 text-[#173862] hover:bg-white/92 hover:shadow-[0_12px_22px_rgba(34,78,154,0.12)]"
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span className="truncate text-[15px] font-semibold">{option.label}</span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
                    selected ? "border-white/35 bg-white/18 text-white" : "border-[#d7e4f7] bg-white/72 text-[#7e95ba]"
                  }`}
                >
                  {selected ? <CheckIcon /> : <DotIcon />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ToggleField({
  checked,
  icon,
  label,
  offText,
  onText,
  onChange,
}: {
  checked: boolean;
  icon: ReactNode;
  label: string;
  offText: string;
  onText: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="calculator-field-shell flex items-center gap-3 rounded-[22px] border border-white/58 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(240,246,255,0.9)_100%)] px-4 py-4 text-[#173862] shadow-[0_16px_30px_rgba(28,78,160,0.12),inset_0_1px_0_rgba(255,255,255,0.75)]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#edf5ff_0%,#dce9ff_100%)] text-[#3c75d0] shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <span className="block text-xs font-black uppercase tracking-[0.18em] text-[#17212f]">{label}</span>
        <button
          type="button"
          className="mt-1.5 flex w-full items-center justify-between gap-3 text-left text-base font-bold text-[#173862]"
          onClick={() => onChange(!checked)}
        >
          <span>{checked ? onText : offText}</span>
          <span
            className={`flex h-8 w-14 items-center rounded-full p-1 transition ${checked ? "bg-[#4f8fe8]" : "bg-[#d9e6f7]"}`}
          >
            <span className={`h-6 w-6 rounded-full bg-white shadow transition ${checked ? "translate-x-6" : ""}`} />
          </span>
        </button>
      </div>
    </div>
  );
}

function FieldShell({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="calculator-field-shell flex items-center gap-3 rounded-[22px] border border-white/58 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(240,246,255,0.9)_100%)] px-4 py-4 text-[#173862] shadow-[0_16px_30px_rgba(28,78,160,0.12),inset_0_1px_0_rgba(255,255,255,0.75)]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#edf5ff_0%,#dce9ff_100%)] text-[#3c75d0] shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <span className="block text-xs font-black uppercase tracking-[0.18em] text-[#17212f]">{label}</span>
        {children}
      </div>
    </div>
  );
}

function DotPattern() {
  return (
    <svg viewBox="0 0 176 144" className="h-full w-full fill-white/45" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 11 }).map((_, column) => (
          <circle key={`${row}-${column}`} cx={12 + column * 15} cy={12 + row * 15} r={row > 5 && column > 8 ? 0 : 4.2} />
        )),
      )}
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" aria-hidden="true">
      <path d="M12 21s6-5.7 6-10.3A6 6 0 1 0 6 10.7C6 15.3 12 21 12 21Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function WeightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" aria-hidden="true">
      <path d="M8.4 7.4 10.2 4h3.6l1.8 3.4" />
      <path d="M6 8h12l1 10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8Z" />
      <path d="M12 11.5v4" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" aria-hidden="true">
      <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z" />
      <path d="M4 7.5 12 12l8-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function CargoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" aria-hidden="true">
      <path d="M3.5 8.2 12 3l8.5 5.2v7.6L12 21l-8.5-5.2V8.2Z" />
      <path d="M12 3v18" />
      <path d="m3.5 8.2 8.5 5.1 8.5-5.1" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6.5 9.5V20h11V9.5" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

function StairsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" aria-hidden="true">
      <path d="M4 19h5v-4h5v-4h6" />
      <path d="M4 15h5v-4h5V7h6" />
    </svg>
  );
}

function LiftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" aria-hidden="true">
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M10 8h4" />
      <path d="M12 11v5" />
      <path d="m9.8 13.2 2.2-2.2 2.2 2.2" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" aria-hidden="true">
      <path d="M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M18 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M8.6 13.4 15.4 9" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" aria-hidden="true">
      <path d="M7 3h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2V5a2 2 0 0 1 2-2Z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" aria-hidden="true">
      <path d="m5 12.5 4.2 4.2L19 7.8" />
    </svg>
  );
}

function DotIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
    </svg>
  );
}
