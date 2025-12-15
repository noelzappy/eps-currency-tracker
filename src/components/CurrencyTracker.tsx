import { useMemo, useState } from 'react'
import { Calendar } from 'lucide-react'
import { useCurrencies } from '../hooks/useCurrencies'
import { useHistoricalRates } from '../hooks/useHistoricalRates'
import { CurrencyTable } from './CurrencyTable'
import CustomSelect from './CustomSelect'

export const CurrencyTracker = () => {
  const [baseCurrency, setBaseCurrency] = useState('gbp')
  const [referenceDate, setReferenceDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  )
  const [targetCurrencies, setTargetCurrencies] = useState<Array<string>>([
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

  const { minDate, maxDate } = useMemo(() => {
    const today = new Date()
    const _maxDate = today.toISOString().split('T')[0]
    const minDateObj = new Date()
    minDateObj.setDate(today.getDate() - 90)
    const _minDate = minDateObj.toISOString().split('T')[0]
    return { minDate: _minDate, maxDate: _maxDate }
  }, [referenceDate])

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 min-w-0">
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Market Dashboard
        </h1>
        <p className="text-blue-100/80 font-light">
          Monitor real-time exchange rate trends.
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-2xl">
        <div className=" p-6 md:p-8 flex flex-col xl:flex-row gap-8 items-start justify-between">
          <div className="flex flex-col md:flex-row gap-6 w-full xl:w-auto">
            <div className="space-y-2 w-full md:w-96 relative group">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                Base Currency
              </label>
              <div className="relative">
                <CustomSelect
                  options={
                    currencyList
                      ? Object.entries(currencyList).map(([code, name]) => ({
                          value: code,
                          label: `${code.toUpperCase()} — ${name}`,
                        }))
                      : []
                  }
                  value={baseCurrency}
                  onChange={(v) => setBaseCurrency(Array.isArray(v) ? (v[0] ?? baseCurrency) : v)}
                  isLoading={isLoadingCurrencies}
                  placeholder="Select base currency"
                />
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
                  title="Date"
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
          <CurrencyTable
            data={historicalRates}
            currencies={targetCurrencies}
            isLoading={isLoadingRates}
            onCurrenciesChange={setTargetCurrencies}
            currencyList={currencyList}
            
          />
        </div>
      </div>
    </div>
  )
}
