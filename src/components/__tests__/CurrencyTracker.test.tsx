import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CurrencyTracker } from '../CurrencyTracker'
import * as useCurrenciesHook from '@/hooks/useCurrencies'
import * as useHistoricalRatesHook from '@/hooks/useHistoricalRates'

// Mock the hooks
vi.mock('@/hooks/useCurrencies')
vi.mock('@/hooks/useHistoricalRates')

// Mock child components to simplify testing
vi.mock('../CurrencyTable', () => ({
  CurrencyTable: ({ data, currencies, isLoading, onCurrenciesChange }: any) => (
    <div data-testid="currency-table">
      <div>Table Loading: {isLoading.toString()}</div>
      <div>Currencies: {currencies.join(', ')}</div>
      <div>Data Count: {data.length}</div>
      <button onClick={() => onCurrenciesChange(['usd', 'eur'])}>
        Change Currencies
      </button>
    </div>
  ),
}))

vi.mock('../CustomSelect', () => ({
  default: ({ value, onChange, options, placeholder }: any) => (
    <select
      data-testid="custom-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}))

describe('CurrencyTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementations
    vi.spyOn(useCurrenciesHook, 'useCurrencies').mockReturnValue({
      data: {
        usd: 'US Dollar',
        eur: 'Euro',
        gbp: 'British Pound',
      },
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    vi.spyOn(useHistoricalRatesHook, 'useHistoricalRates').mockReturnValue({
      data: [{ date: '2023-10-01', rates: { usd: 1.2 } }],
      isLoading: false,
      isError: false,
    })
  })

  it('renders with default state', () => {
    render(<CurrencyTracker />)

    expect(screen.getByText('Market Dashboard')).toBeInTheDocument()
    expect(screen.getByTitle('Date')).toBeInTheDocument()

    // Default base currency is gbp
    const select = screen.getByTestId('custom-select') as HTMLSelectElement
    expect(select.value).toBe('gbp')
  })

  it('updates reference date', () => {
    render(<CurrencyTracker />)

    const dateInput = screen.getByTitle('Date')
    fireEvent.change(dateInput, { target: { value: '2023-01-01' } })

    expect(dateInput).toHaveValue('2023-01-01')

    // Verify hook was called with new date
    // Note: The hook is called on render, so we check the last call
    expect(useHistoricalRatesHook.useHistoricalRates).toHaveBeenLastCalledWith(
      expect.any(String), // baseCurrency
      expect.any(Date), // referenceDate
    )
  })

  it('updates base currency', () => {
    render(<CurrencyTracker />)

    const select = screen.getByTestId('custom-select')
    fireEvent.change(select, { target: { value: 'eur' } })

    expect(useHistoricalRatesHook.useHistoricalRates).toHaveBeenLastCalledWith(
      'eur',
      expect.any(Date),
    )
  })

  it('handles target currencies updates from table', () => {
    render(<CurrencyTracker />)

    const changeButton = screen.getByText('Change Currencies')
    fireEvent.click(changeButton)

    expect(screen.getByText('Currencies: usd, eur')).toBeInTheDocument()
  })

  it('passes loading states to children', () => {
    vi.spyOn(useHistoricalRatesHook, 'useHistoricalRates').mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    })

    render(<CurrencyTracker />)

    expect(screen.getByText('Table Loading: true')).toBeInTheDocument()
  })
})
