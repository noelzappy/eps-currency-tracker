import { Info } from 'lucide-react'
import { useMemo, useState } from 'react'
import CustomSelect from './CustomSelect'
import type { CurrencyMap } from '../hooks/useCurrencies'
import type { DailyRate } from '../hooks/useHistoricalRates'
import { cn } from '@/lib/utils'

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
  const [isEditing, setIsEditing] = useState(false)

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
      <span className="flex items-center gap-1 text-gray-500 lg:hidden px-4">
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
                  <div className="flex items-center justify-between">
                    <span>Currency</span>
                    {currencies.length > 0 && (
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-sky-600 hover:text-sky-700 transition-colors text-xs font-bold uppercase tracking-wider bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded-md"
                      >
                        {isEditing ? 'Done' : 'Edit'}
                      </button>
                    )}
                  </div>
                </th>
                {sortedData.map((day) => (
                  <th
                    key={day.date}
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap min-w-30"
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
                  className="hover:bg-sky-50/30 transition-colors group animate-slide-in"
                >
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900 uppercase sticky left-0 bg-white group-hover:bg-sky-50/30 transition-colors z-10 after:absolute after:inset-y-0 after:right-0 after:w-4 after:translate-x-full after:pointer-events-none after:bg-gradient-to-r after:from-black/5 after:to-transparent border-r border-transparent">
                    <div className="flex items-center gap-3 transition-all duration-300">
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isEditing ? 'w-8 opacity-100 mr-1' : 'w-0 opacity-0'
                        }`}
                      >
                        <button
                          onClick={() => {
                            if (onCurrenciesChange) {
                              onCurrenciesChange(
                                currencies.filter((c) => c !== currency),
                              )
                            }
                          }}
                          className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors cursor-pointer"
                          title="Remove currency"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-100 md:flex items-center justify-center text-sky-700 text-xs font-bold hidden">
                          {currency.slice(0, 1)}
                        </div>
                        <span className="font-exbold tracking-tight">
                          {currency}
                        </span>
                      </div>
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

      {/* Add more currencies button  */}
      <div className="mt-2 mb-20 px-6 pb-8">
        <div className="w-64">
          <CustomSelect
            options={
              currencyList
                ? Object.entries(currencyList)
                    .filter(([code]) => !currencies.includes(code))
                    .map(([code, name]) => ({
                      value: code,
                      label: `${code.toUpperCase()} — ${name}`,
                    }))
                : []
            }
            value=""
            onChange={(value) => {
              if (!onCurrenciesChange) return
              if (currencies.includes(value)) return
              if (currencies.length >= 7) return
              onCurrenciesChange([...currencies, value])
            }}
            placeholder="Add currency"
            isLoading={!currencyList}
            disabled={currencies.length >= 7}
            customTarget={
              <button
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-xl transition-all font-semibold text-sm',
                  currencies.length >= 7
                    ? 'bg-gray-100 cursor-not-allowed hover:border-gray-200 text-gray-400'
                    : ' text-sky-600 bg-sky-50 hover:bg-sky-100',
                )}
              >
                <div
                  className={cn(
                    'rounded-full p-0.5',
                    currencies.length >= 7 ? 'bg-gray-400' : 'bg-sky-500',
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                Add currency
              </button>
            }
          />
        </div>
      </div>
    </>
  )
}
