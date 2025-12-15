/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react'
import { useSelectState } from '../hooks/useSelectState'
import type { Option } from '../hooks/useSelectState'

interface MultiSelectProps {
  options: Array<Option>
  value: Array<string>
  onChange: (value: Array<string>) => void
  placeholder?: string
  isLoading?: boolean
  className?: string
  maxVisibleTags?: number
  customTarget?: React.ReactNode
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isLoading = false,
  className = '',
  maxVisibleTags = 3,
  customTarget,
}) => {
  const {
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
  } = useSelectState({ options, value, multiple: true })

  const selected = options.filter((o) => value.includes(o.value))

  function toggle(valueToToggle: string) {
    const cur = value.slice()
    const idx = cur.indexOf(valueToToggle)
    if (idx === -1) cur.push(valueToToggle)
    else cur.splice(idx, 1)
    onChange(cur)
  }

  function remove(valueToRemove: string) {
    const cur = value.slice()
    const idx = cur.indexOf(valueToRemove)
    if (idx === -1) return
    cur.splice(idx, 1)
    onChange(cur)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {customTarget ? (
        <div
          role="button"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => {
            setOpen((o) => !o)
            setTimeout(() => inputRef.current?.focus(), 0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setOpen((o) => !o)
              setTimeout(() => inputRef.current?.focus(), 0)
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
          onClick={() => {
            setOpen((o) => !o)
            setTimeout(() => inputRef.current?.focus(), 0)
          }}
          className="w-full flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 text-gray-900 text-lg rounded-xl p-3 pr-3 font-bold hover:bg-white hover:shadow-sm"
        >
          <div className="flex items-center gap-2 truncate text-left">
            {selected.length > 0 ? (
              (() => {
                const visible = selected.slice(0, maxVisibleTags)
                const more = selected.length - visible.length
                return (
                  <div className="flex items-center gap-2 truncate">
                    {visible.map((s) => (
                      <button
                        key={s.value}
                        onClick={(e) => {
                          e.stopPropagation()
                          remove(s.value)
                        }}
                        className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded-full"
                        aria-label={`Selected ${s.label}`}
                        type="button"
                      >
                        <span className="truncate max-w-32">{s.label}</span>
                        <svg
                          className="w-3 h-3 text-sky-700 ml-1"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M6 6l8 8M14 6l-8 8"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    ))}
                    {more > 0 && (
                      <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        +{more}
                      </span>
                    )}
                  </div>
                )
              })()
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

      {open && (
        <div className="absolute z-50 left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="p-3">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                handleKeyDown(e)
                if (e.key === 'Enter') {
                  const opt = filtered[highlight]
                  if (opt) toggle(opt.value)
                }
              }}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <ul
            role="listbox"
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
                  aria-selected={value.includes(opt.value)}
                  onMouseEnter={() => setHighlight(idx)}
                  onClick={() => toggle(opt.value)}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md cursor-pointer ${idx === highlight ? 'bg-sky-50 text-sky-900' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-sm truncate">{opt.label}</div>
                  </div>
                  {value.includes(opt.value) && (
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

export default MultiSelect
