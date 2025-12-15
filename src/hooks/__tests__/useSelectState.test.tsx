import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useSelectState } from '../useSelectState'

describe('useSelectState', () => {
  const options = [
    { value: 'usd', label: 'US Dollar' },
    { value: 'eur', label: 'Euro' },
    { value: 'gbp', label: 'British Pound' },
  ]

  it('initializes with correct default values', () => {
    const { result } = renderHook(() =>
      useSelectState({ options, value: 'usd' }),
    )

    expect(result.current.open).toBe(false)
    expect(result.current.query).toBe('')
    expect(result.current.selected.item).toEqual({
      value: 'usd',
      label: 'US Dollar',
    })
    expect(result.current.filtered).toHaveLength(3)
  })

  it('updates filtered options based on query', () => {
    const { result } = renderHook(() => useSelectState({ options, value: '' }))

    act(() => {
      result.current.setQuery('Euro')
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].value).toBe('eur')
  })

  it('handles interactions', () => {
    const { result } = renderHook(() => useSelectState({ options, value: '' }))

    act(() => {
      result.current.setOpen(true)
    })
    expect(result.current.open).toBe(true)

    act(() => {
      result.current.setOpen(false)
    })
    expect(result.current.open).toBe(false)
  })

  it('correctly identifies selected item index', () => {
    const { result } = renderHook(() =>
      useSelectState({ options, value: 'eur' }),
    )

    expect(result.current.selected.index).toBe(1)
  })
})
