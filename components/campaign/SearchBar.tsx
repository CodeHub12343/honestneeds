'use client'

import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import styled from 'styled-components'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  debounceMs?: number
}

// Styled Components
const Container = styled.div`
  position: relative;
`

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
`

const StyledInput = styled.input`
  width: 100%;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #111827;
  background-color: white;
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1),
      0 0 0 3px rgb(99, 102, 241);
  }
`

const ClearButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.2s ease;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #4b5563;
  }

  &:focus {
    outline: none;
  }
`

export function SearchBar({
  onSearch,
  placeholder = 'Search campaigns...',
  debounceMs = 300,
}: SearchBarProps) {
  const [value, setValue] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('')

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, debounceMs])

  // Call onSearch when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  const handleClear = () => {
    setValue('')
  }

  return (
    <Container>
      <SearchIcon size={20} />
      <StyledInput
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <ClearButton
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={20} />
        </ClearButton>
      )}
    </Container>
  )
}
