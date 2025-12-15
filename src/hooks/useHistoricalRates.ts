import { useQueries } from '@tanstack/react-query'

export interface DailyRate {
  date: string
  rates: { [currency: string]: number }
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const getPastDates = (referenceDate: Date, days: number): string[] => {
  const dates: string[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(referenceDate)
    d.setDate(d.getDate() - i)
    dates.push(formatDate(d))
  }
  return dates
}

export const useHistoricalRates = (
  baseCurrency: string,
  referenceDate: Date,
) => {
  const dates = getPastDates(referenceDate, 7)

  const queries = dates.map((date) => ({
    queryKey: ['rates', baseCurrency, date],
    queryFn: async () => {
      const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${baseCurrency}.json`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch rates for ${date}`)
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 60 * 24,
    retry: 1,
  }))

  const results = useQueries({ queries })

  const isLoading = results.some((r) => r.isLoading)
  const isError = results.some((r) => r.isError)

  const data: DailyRate[] = results.map((result, index) => {
    const date = dates[index]
    if (result.data && result.data[baseCurrency]) {
      return {
        date,
        rates: result.data[baseCurrency],
      }
    }
    return { date, rates: {} }
  })

  return { data, isLoading, isError }
}
