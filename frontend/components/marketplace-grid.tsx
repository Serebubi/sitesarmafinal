import Image from "next/image";
import type { ReactNode } from "react";

import { humanizeMarketplace, marketplaceById, marketplaces, type MarketplaceId } from "shared";

interface MarketplaceGridProps {
  value: MarketplaceId | "";
  onSelect: (marketplace: MarketplaceId) => void;
  filter?: MarketplaceId[];
  children?: ReactNode;
}

export function MarketplaceGrid({ value, onSelect, filter, children }: MarketplaceGridProps) {
  const visibleMarketplaces = filter ? marketplaces.filter((m) => filter.includes(m.id)) : marketplaces;
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:gap-4 ${
        filter ? "mx-auto w-full max-w-5xl sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }`}
    >
      {visibleMarketplaces.map((marketplace, index) => {
        const active = value === marketplace.id;

        return (
          <button
            key={marketplace.id}
            type="button"
            onClick={() => onSelect(marketplace.id)}
            className={`stagger-in marketplace-tile group relative flex min-h-[132px] flex-col items-center justify-center overflow-hidden rounded-[22px] border px-3 py-4 text-center sm:min-h-[152px] sm:rounded-[28px] sm:px-5 sm:py-5 ${
              active
                ? "border-[color:rgba(196,46,160,0.32)] bg-white shadow-[0_20px_44px_rgba(123,77,255,0.18)]"
                : "border-[color:var(--line)] bg-white/88 hover:-translate-y-1 hover:border-[color:rgba(123,77,255,0.16)] hover:shadow-[0_16px_32px_rgba(59,26,110,0.08)]"
            }`}
            style={{ animationDelay: `${index * 55}ms` }}
          >
            {active ? (
              <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[linear-gradient(135deg,#c42ea0,#7c33ff)] text-xs font-bold text-white shadow-[0_10px_18px_rgba(123,77,255,0.22)] sm:right-4 sm:top-4">
                ✓
              </span>
            ) : null}
            <span className="flex h-16 w-20 items-center justify-center rounded-[18px] bg-[color:var(--surface-subtle)] px-2 sm:h-20 sm:w-24 sm:rounded-[22px] sm:px-3">
              <Image
                src={`/marketplaces/${marketplace.asset}`}
                alt={humanizeMarketplace(marketplace.id)}
                width={120}
                height={40}
                className={`h-8 w-[96px] object-contain transition duration-200 sm:h-10 sm:w-[120px] ${
                  active ? "" : "grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100"
                }`}
              />
            </span>
            <span className="mt-3 flex flex-col items-center gap-2 sm:mt-4">
              <span className="text-sm font-semibold leading-5 text-[color:var(--foreground)] sm:text-base sm:leading-6">{humanizeMarketplace(marketplace.id)}</span>
              <span className="rounded-full bg-[color:var(--surface-subtle)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[color:var(--muted)] sm:px-3 sm:text-[10px] sm:tracking-[0.22em]">
                {marketplaceById[marketplace.id].parserMode === "supported" ? "smart" : "manual"}
              </span>
            </span>
          </button>
        );
      })}
      {children}
    </div>
  );
}
