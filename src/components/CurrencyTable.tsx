import { Info } from 'lucide-react'
import { useMemo } from 'react'
import MultiSelect from './MultiSelect'
import type { CurrencyMap } from '../hooks/useCurrencies'
import type { DailyRate } from '../hooks/useHistoricalRates'

interface CurrencyTableProps {
  data: Array<DailyRate>
  currencies: Array<string>
  isLoading: boolean
  currencyList?: CurrencyMap
  onCurrenciesChange?: (currencies: Array<string>) => void
}

export const CurrencyTable = ({
  data,
  currencies,
  isLoading,
  currencyList,
  onCurrenciesChange,
}: CurrencyTableProps) => {
  const sortedData = useMemo(
    () =>
      [...data].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [data],
  )

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full rounded-xl border border-gray-100/80 bg-white shadow-sm p-4"
      >
        <span className="sr-only">Loading exchange rates</span>

        <div className="animate-pulse">
          <div className="overflow-hidden rounded-md">
            <div className="space-y-3 px-2">
              {Array.from({ length: 7 }).map((_, row) => (
                <div key={row} className="flex items-center gap-4">
                  <div className="h-10 w-36 rounded bg-gray-100" />
                  <div className="flex-1 flex gap-2 justify-end">
                    {Array.from({ length: 6 }).map((__, col) => (
                      <div key={col} className="h-8 w-28 rounded bg-gray-100" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <span className="flex items-center gap-1 text-white lg:hidden">
        <Info className="w-3 h-3" />
        <p className="text-xs">Scroll to the right to see the full history</p>
      </span>
      <div className="w-full overflow-hidden rounded-xl border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
        <div className="overflow-x-auto custom-scrollbar pb-1">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/80 backdrop-blur border-b border-gray-200/60">
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50/95 backdrop-blur z-20 after:absolute after:inset-y-0 after:right-0 after:w-4 after:translate-x-full after:pointer-events-none after:bg-gradient-to-r after:from-black/5 after:to-transparent"
                >
                  Currency
                </th>
                {sortedData.map((day) => (
                  <th
                    key={day.date}
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap min-w-[120px]"
                  >
                    {new Date(day.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currencies.map((currency) => (
                <tr
                  key={currency}
                  className="hover:bg-sky-50/30 transition-colors group"
                >
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900 uppercase sticky left-0 bg-white group-hover:bg-sky-50/30 transition-colors z-10 after:absolute after:inset-y-0 after:right-0 after:w-4 after:translate-x-full after:pointer-events-none after:bg-gradient-to-r after:from-black/5 after:to-transparent border-r border-transparent">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 md:flex items-center justify-center text-sky-700 text-xs font-bold hidden">
                        {currency.slice(0, 1)}
                      </div>
                      <span className="font-exbold tracking-tight">
                        {currency}
                      </span>
                    </div>
                  </td>
                  {sortedData.map((day) => {
                    const rate = day.rates[currency]
                    return (
                      <td
                        key={`${currency}-${day.date}`}
                        className="px-6 py-5 whitespace-nowrap text-sm text-right font-mono text-gray-600 group-hover:text-sky-900 transition-colors"
                      >
                        {rate ? (
                          <span className="bg-gray-50 px-2 py-1 rounded-md group-hover:bg-white group-hover:shadow-sm transition-all text-xs md:text-sm">
                            {rate.toFixed(5)}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="relative">
        <MultiSelect
          options={
            currencyList
              ? Object.entries(currencyList).map(([code, name]) => ({
                  value: code,
                  label: `${code.toUpperCase()} — ${name}`,
                }))
              : []
          }
          value={currencies}
          onChange={(value) => {
            if (!onCurrenciesChange) return
            if (Array.isArray(value)) {
              onCurrenciesChange(value)
            } else {
              onCurrenciesChange([value])
            }
          }}
          placeholder="Add currency"
          isLoading={!currencyList}
          customTarget={
            <span className="absolute top-2 right-2 text-xs text-gray-400 underline underline-offset-2 cursor-pointer hover:text-sky-600">
              Add / Remove currencies
            </span>
          }
        />
      </div>
    </>
  )
}
