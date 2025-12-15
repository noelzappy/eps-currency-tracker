/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React, { useEffect, useState } from 'react'
import { useSelectState } from '@/hooks/useSelectState'
import { cn } from '@/lib/utils'

export interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  options: Array<Option>
  value: string
  onChange: (value: string) => void
  placeholder?: string
  isLoading?: boolean
  className?: string
  customTarget?: React.ReactNode
  disabled?: boolean
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isLoading = false,
  className = '',
  customTarget,
  disabled = false,
}) => {
  const {
    selected,
    open,
    setOpen,
    query,
    setQuery,
    filtered,
    containerRef,
    inputRef,
    handleKeyDown,
  } = useSelectState({ options, value })

  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>(
    'bottom',
  )
  const [closing, setClosing] = useState(false)
  const isRendered = open || closing

  useEffect(() => {
    if (open) {
      setClosing(false)
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        if (spaceBelow < 250) {
          setDropdownPosition('top')
        } else {
          setDropdownPosition('bottom')
        }
      }
    } else if (!open && isRendered) {
      setClosing(true)
    }
  }, [open, isRendered, containerRef])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {customTarget ? (
        <div
          role="button"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => {
            if (disabled) return
            if (open) {
              setClosing(true)
              // let animation play
            } else {
              setOpen(true)
              setTimeout(() => inputRef.current?.focus(), 0)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (open) {
                setClosing(true)
              } else {
                setOpen(true)
                setTimeout(() => inputRef.current?.focus(), 0)
              }
            }
          }}
        >
          {customTarget}
        </div>
      ) : (
        <button
          title="Open dropdown"
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => {
            if (disabled) return
            if (open) {
              setClosing(true)
            } else {
              setOpen(true)
              setTimeout(() => inputRef.current?.focus(), 0)
            }
          }}
          className={cn(
            'w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all text-sm',
            disabled
              ? 'bg-gray-100 cursor-not-allowed hover:border-gray-200'
              : '',
          )}
        >
          <div className="flex items-center gap-2 truncate text-left">
            {selected.item ? (
              <span className="truncate">{selected.item.label}</span>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>
          <svg
            className="w-4 h-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {isRendered && (
        <div
          role="dialog"
          aria-modal="false"
          onAnimationEnd={() => {
            if (closing) {
              setClosing(false)
              setOpen(false)
            }
          }}
          style={{
            ['--radix-dropdown-menu-content-transform-origin' as any]:
              dropdownPosition === 'bottom' ? 'top center' : 'bottom center',
          }}
          className={cn(
            'absolute z-50 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg',
            dropdownPosition === 'bottom'
              ? 'top-full mt-2'
              : 'bottom-full mb-2',
            closing ? 'animate-dropdown-exit' : 'animate-dropdown-enter',
          )}
        >
          <div className="p-3">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <ul
            role="listbox"
            title="Select items"
            tabIndex={-1}
            className="max-h-56 overflow-auto p-2 space-y-1"
          >
            {isLoading ? (
              <li className="p-2 text-center text-sm text-gray-400">
                Loading...
              </li>
            ) : filtered.length === 0 ? (
              <li className="p-2 text-sm text-gray-500">No results</li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt.value}
                  id={opt.value}
                  role="option"
                  aria-selected={value === opt.value}
                  onClick={() => {
                    onChange(opt.value)
                    setClosing(true)
                    setTimeout(() => {
                      setOpen(false)
                      setQuery('')
                    }, 150)
                  }}
                  className={cn(
                    'flex items-center justify-between gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-sky-50',
                    value === opt.value ? 'bg-sky-100' : '',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-sm truncate">{opt.label}</div>
                  </div>
                  {value === opt.value && (
                    <svg
                      className="w-4 h-4 text-sky-600"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M5 10l3 3 7-7"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CustomSelect
