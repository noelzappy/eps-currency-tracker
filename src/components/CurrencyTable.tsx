import type { DailyRate } from '../hooks/useHistoricalRates'

interface CurrencyTableProps {
  data: DailyRate[]
  currencies: string[]
  isLoading: boolean
}

export const CurrencyTable = ({
  data,
  currencies,
  isLoading,
}: CurrencyTableProps) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  if (isLoading) {
    return (
      <div className="w-full h-80 flex flex-col items-center justify-center text-gray-400 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 animate-pulse gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-sky-200 border-t-sky-600 animate-spin" />
        <span className="text-sm font-medium text-sky-800/60">
          Fetching latest rates...
        </span>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
      <div className="overflow-x-auto custom-scrollbar pb-1">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/80 backdrop-blur border-b border-gray-200/60">
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50/95 backdrop-blur z-20 shadow-[4px_0_24px_-2px_rgba(0,0,0,0.05)]"
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
                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900 uppercase sticky left-0 bg-white group-hover:bg-sky-50/30 transition-colors z-10 shadow-[4px_0_24px_-2px_rgba(0,0,0,0.05)] border-r border-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-xs font-bold">
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
  )
}
