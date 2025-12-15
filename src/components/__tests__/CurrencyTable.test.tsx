import { render, screen } from '@testing-library/react'
import { CurrencyTable } from '../CurrencyTable'
import { describe, it, expect } from 'vitest'
import { DailyRate } from '../../hooks/useHistoricalRates'

describe('CurrencyTable', () => {
  const mockData: DailyRate[] = [
    { date: '2023-10-07', rates: { usd: 1.25, eur: 1.15 } },
    { date: '2023-10-06', rates: { usd: 1.24, eur: 1.14 } },
  ]

  const mockCurrencies = ['usd', 'eur']

  it('renders loading state', () => {
    render(
      <CurrencyTable
        data={[]}
        currencies={[]}
        isLoading={true}
        currencyList={{}}
        onCurrenciesChange={() => {}}
      />,
    )
    expect(screen.getByText(/Loading exchange rates/i)).toBeInTheDocument()
  })

  it('renders table headers with dates', () => {
    render(
      <CurrencyTable
        data={mockData}
        currencies={mockCurrencies}
        isLoading={false}
      />,
    )

    // Check for Currency column
    expect(screen.getByText('Currency')).toBeInTheDocument()

    // Check for Dates (formatted roughly)
    // 2023-10-07 -> Oct 7, Sat (depending on locale, strict match checks for one part)
    expect(screen.getByText(/Oct 7/i)).toBeInTheDocument()
    expect(screen.getByText(/Oct 6/i)).toBeInTheDocument()
  })

  it('renders currency rows and rates', () => {
    render(
      <CurrencyTable
        data={mockData}
        currencies={mockCurrencies}
        isLoading={false}
      />,
    )

    // Currencies
    expect(screen.getByText('usd')).toBeInTheDocument()
    expect(screen.getByText('eur')).toBeInTheDocument()

    // Rates (1.25000)
    expect(screen.getByText('1.25000')).toBeInTheDocument()
    expect(screen.getByText('1.15000')).toBeInTheDocument()
  })

  it('renders placeholder for missing rates', () => {
    const incompleteData: DailyRate[] = [
      { date: '2023-10-07', rates: { usd: 1.25 } }, // eur missing
    ]
    render(
      <CurrencyTable
        data={incompleteData}
        currencies={['usd', 'eur']}
        isLoading={false}
      />,
    )

    expect(screen.getByText('1.25000')).toBeInTheDocument()
    // Should find dash for Euro
    expect(screen.getAllByText('-')).toHaveLength(1)
  })
})
