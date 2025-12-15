/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react'
import { useSelectState } from '@/hooks/useSelectState'

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
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isLoading = false,
  className = '',
}) => {
  const {
    selected,
    open,
    setOpen,
    query,
    setQuery,
    highlight,
    setHighlight,
    filtered,
    containerRef,
    inputRef,
    handleKeyDown,
  } = useSelectState({ options, value, multiple: false })

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        title="Open dropdown"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
        className="w-full flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 text-gray-900 text-lg rounded-xl p-3 pr-3 font-bold hover:bg-white hover:shadow-sm"
      >
        <div className="flex items-center gap-2 truncate text-left">
          {selected ? (
            <span className="truncate">{(selected as Option).label}</span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="none">
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          className="absolute z-50 left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg"
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
            aria-activedescendant={filtered[highlight]?.value}
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
              filtered.map((opt, idx) => (
                <li
                  key={opt.value}
                  id={opt.value}
                  role="option"
                  aria-selected={value === opt.value}
                  onMouseEnter={() => setHighlight(idx)}
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                    setQuery('')
                  }}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md cursor-pointer ${idx === highlight ? 'bg-sky-50 text-sky-900' : 'hover:bg-gray-50'}`}
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
