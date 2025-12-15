import { useState } from 'react'
import { useCurrencies } from '../hooks/useCurrencies'
import { useHistoricalRates } from '../hooks/useHistoricalRates'
import { CurrencyTable } from './CurrencyTable'
import { Calendar } from 'lucide-react'

export const CurrencyTracker = () => {
  // defaults
  const [baseCurrency, setBaseCurrency] = useState('gbp')
  const [referenceDate, setReferenceDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  )
  const [targetCurrencies, setTargetCurrencies] = useState<string[]>([
    'usd',
    'eur',
    'jpy',
    'chf',
    'cad',
    'aud',
    'zar',
  ])

  const { data: currencyList, isLoading: isLoadingCurrencies } = useCurrencies()
  const { data: historicalRates, isLoading: isLoadingRates } =
    useHistoricalRates(baseCurrency, new Date(referenceDate))

  const today = new Date()
  const maxDate = today.toISOString().split('T')[0]
  const minDateObj = new Date()
  minDateObj.setDate(today.getDate() - 90)
  const minDate = minDateObj.toISOString().split('T')[0]

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-8 pb-20 min-w-0">
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Market Dashboard
        </h1>
        <p className="text-blue-100/80 font-light">
          Monitor real-time exchange rate trends.
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 md:p-8 flex flex-col xl:flex-row gap-8 items-start justify-between border border-white/20">
        <div className="flex flex-col md:flex-row gap-6 w-full xl:w-auto">
          <div className="space-y-2 w-full md:w-64 relative group">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
              Base Currency
            </label>
            <div className="relative">
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-lg rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 block w-full p-4 pr-10 uppercase font-bold transition-all hover:bg-white hover:shadow-sm cursor-pointer"
              >
                {isLoadingCurrencies ? (
                  <option>Loading...</option>
                ) : (
                  currencyList &&
                  Object.entries(currencyList).map(([code, name]) => (
                    <option key={code} value={code}>
                      {code.toUpperCase()} — {name}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400 group-hover:text-sky-600 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2 w-full md:w-56">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
              Reference Date
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-sky-500 transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                type="date"
                value={referenceDate}
                min={minDate}
                max={maxDate}
                onChange={(e) => setReferenceDate(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 block w-full pl-12 p-4 font-medium transition-all hover:bg-white hover:shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Exchange Rate History
            </h2>
          </div>
          <div className="hidden md:block">
            <span className="bg-sky-800/50 text-sky-100 text-xs px-3 py-1 rounded-full font-medium border border-sky-700/50">
              7 Days Range
            </span>
          </div>
        </div>

        <CurrencyTable
          data={historicalRates}
          currencies={targetCurrencies}
          isLoading={isLoadingRates}
        />
      </div>
    </div>
  )
}
