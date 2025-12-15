import { useEffect, useMemo, useRef, useState } from 'react'

export interface Option {
  value: string
  label: string
}

interface UseSelectStateArgs {
  options: Array<Option>
  value: string | Array<string>
}

export function useSelectState({ options, value }: UseSelectStateArgs) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const selected = useMemo(() => {
    const found = options.find((o) => o.value === value) || null

    const index = options.findIndex((o) => o.value === value)

    return { item: found, index }
  }, [options, value])

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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true)
      return
    }
    if (e.key === 'Escape') setOpen(false)
  }

  return {
    open,
    selected,
    query,
    filtered,
    containerRef,
    inputRef,
    setQuery,
    handleKeyDown,
    setOpen,
  }
}
