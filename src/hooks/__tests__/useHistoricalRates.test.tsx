import { renderHook, waitFor } from '@testing-library/react'
import { useHistoricalRates } from '../useHistoricalRates'
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// Setup QueryClient for testing
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useHistoricalRates', () => {
  beforeAll(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('fetches rates for 7 days correctly', async () => {
    const mockData = {
      date: '2023-10-01',
      gbp: { usd: 1.25, eur: 1.15 },
    }

    // Mock fetch to return success
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    })

    const referenceDate = new Date('2023-10-07')

    const { result } = renderHook(
      () => useHistoricalRates('gbp', referenceDate),
      {
        wrapper: createWrapper(),
      },
    )

    // Initially loading
    expect(result.current.isLoading).toBe(true)

    // Wait for data
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Expect 7 items
    expect(result.current.data).toHaveLength(7)

    // Check if dates are correct (descending/ascending order depends on hook implementation,
    // hook returns [today, yesterday...])
    // 2023-10-07 down to 2023-10-01

    const dates = result.current.data.map((d) => d.date)
    expect(dates).toContain('2023-10-07')
    expect(dates).toContain('2023-10-01')

    // Verify fetch was called 7 times
    expect(global.fetch).toHaveBeenCalledTimes(7)

    // Verify URL construction for one of them
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2023-10-07/v1/currencies/gbp.json',
      ),
    )
  })

  it('handles fetch errors gracefully', async () => {
    // Mock fetch to fail (reject)
    ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

    const referenceDate = new Date('2023-10-07')

    const { result } = renderHook(
      () => useHistoricalRates('gbp', referenceDate),
      {
        wrapper: createWrapper(),
      },
    )

    // useQueries with retry: 1 will retry once.
    // We wait for isLoading to settle.
    await waitFor(() => expect(result.current.isLoading).toBe(false), {
      timeout: 2000,
    })

    // Should return empty rates for failed days but still have structure
    expect(result.current.data).toHaveLength(7)
    expect(result.current.data[0].rates).toEqual({})
    // Since we swallow errors in the map (we just return empty object), isError depends on if we expose it.
    // The hook exposes isError: results.some(r => r.isError)
    expect(result.current.isError).toBe(true)
  })

  it('should not refetch data for the same currency and date when switching back', async () => {
    const referenceDate = new Date('2024-01-08')

    // Mock successful fetch response
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        date: '2024-01-01',
        gbp: { usd: 1.2, eur: 1.1 },
      }),
    })

    // 1. Fetch for GBP
    const { result, rerender } = renderHook(
      ({ currency }) => useHistoricalRates(currency, referenceDate),
      {
        wrapper: createWrapper(),
        initialProps: { currency: 'gbp' },
      },
    )

    // Wait for loading to finish
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const initialCallCount = (global.fetch as any).mock.calls.length
    expect(initialCallCount).toBeGreaterThan(0) // Should have made requests

    // 2. Switch to USD
    rerender({ currency: 'usd' })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const secondCallCount = (global.fetch as any).mock.calls.length
    expect(secondCallCount).toBeGreaterThan(initialCallCount) // Should have made new requests for USD

    // 3. Switch back to GBP
    rerender({ currency: 'gbp' })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // 4. Assert no new requests were made for GBP
    // The total calls should match the count after USD load if caching works
    expect((global.fetch as any).mock.calls.length).toBe(secondCallCount)
  })
})
