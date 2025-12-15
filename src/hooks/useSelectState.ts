import { useEffect, useMemo, useRef, useState } from 'react'

export interface Option {
  value: string
  label: string
}

interface UseSelectStateArgs {
  options: Array<Option>
  value: string | Array<string>
  multiple?: boolean
}

export function useSelectState({
  options,
  value,
  multiple = false,
}: UseSelectStateArgs) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const selected = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      return options.filter((o) => value.includes(o.value))
    }
    if (!multiple && typeof value === 'string') {
      return options.find((o) => o.value === value) || null
    }
    return multiple ? [] : null
  }, [options, value, multiple])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const filtered = useMemo(
    () =>
      options.filter(
        (o) =>
          o.label.toLowerCase().includes(query.toLowerCase()) ||
          o.value.toLowerCase().includes(query.toLowerCase()),
      ),
    [options, query],
  )

  useEffect(() => setHighlight(0), [query, open])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true)
      return
    }
    if (e.key === 'ArrowDown')
      setHighlight((s) => Math.min(s + 1, filtered.length - 1))
    if (e.key === 'ArrowUp') setHighlight((s) => Math.max(s - 1, 0))
    if (e.key === 'Escape') setOpen(false)
  }

  return {
    open,
    selected,
    query,
    highlight,
    filtered,
    containerRef,
    inputRef,
    multiple,
    setQuery,
    handleKeyDown,
    setHighlight,
    setOpen,
  }
}
