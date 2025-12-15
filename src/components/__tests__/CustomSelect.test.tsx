import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CustomSelect } from '../CustomSelect'

describe('CustomSelect', () => {
  const options = [
    { value: 'usd', label: 'USD - US Dollar' },
    { value: 'eur', label: 'EUR - Euro' },
    { value: 'gbp', label: 'GBP - British Pound' },
  ]

  it('renders placeholder when no value selected', () => {
    render(
      <CustomSelect
        options={options}
        value=""
        onChange={() => {}}
        placeholder="Select currency"
      />,
    )
    expect(screen.getByText('Select currency')).toBeInTheDocument()
  })

  it('renders selected option label', () => {
    render(<CustomSelect options={options} value="usd" onChange={() => {}} />)
    expect(screen.getByText('USD - US Dollar')).toBeInTheDocument()
  })

  it('opens dropdown on click', () => {
    render(<CustomSelect options={options} value="" onChange={() => {}} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByTitle('Select items')).toBeInTheDocument()
  })

  it('displays options when opened', () => {
    render(<CustomSelect options={options} value="" onChange={() => {}} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(screen.getByText('USD - US Dollar')).toBeInTheDocument()
    expect(screen.getByText('EUR - Euro')).toBeInTheDocument()
    expect(screen.getByText('GBP - British Pound')).toBeInTheDocument()
  })

  it('calls onChange when option is selected', () => {
    vi.useFakeTimers()
    const handleChange = vi.fn()
    render(<CustomSelect options={options} value="" onChange={handleChange} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const option = screen.getByText('EUR - Euro')
    fireEvent.click(option)

    expect(handleChange).toHaveBeenCalledWith('eur')

    // Fast-forward time to handle the setTimeout in the component
    vi.runAllTimers()
    vi.useRealTimers()
  })

  it('filters options based on search query', () => {
    render(<CustomSelect options={options} value="" onChange={() => {}} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const searchInput = screen.getByPlaceholderText('Search...')
    fireEvent.change(searchInput, { target: { value: 'Euro' } })

    expect(screen.getByText('EUR - Euro')).toBeInTheDocument()
    expect(screen.queryByText('USD - US Dollar')).not.toBeInTheDocument()
  })

  it('renders loading state', () => {
    render(
      <CustomSelect
        options={[]}
        value=""
        onChange={() => {}}
        isLoading={true}
      />,
    )
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
