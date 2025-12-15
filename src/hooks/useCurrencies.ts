import { useQuery } from '@tanstack/react-query'

const CURRENCIES_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'

export interface CurrencyMap {
  [code: string]: string
}

export const useCurrencies = () => {
  return useQuery<CurrencyMap>({
    queryKey: ['currencies'],
    queryFn: async () => {
      const response = await fetch(CURRENCIES_URL)
      if (!response.ok) {
        throw new Error('Failed to fetch currencies')
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}
