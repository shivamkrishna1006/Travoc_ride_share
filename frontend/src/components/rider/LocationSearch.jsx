import { useState, useEffect } from 'react'
import { Input } from '../common'

export default function LocationSearch({ placeholder = 'Search location...', onSelect, value, disabled = false }) {
  const [query, setQuery] = useState(value || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)

    if (val.length > 2) {
      // Mock suggestions - in real app, call geocoding API
      const mockLocations = [
        '123 Main St, City Center',
        '456 Park Ave, Downtown',
        '789 Oak Rd, Uptown',
        '321 River Blvd, Riverside',
        '654 Hill St, Hillside',
      ]
      const filtered = mockLocations.filter((loc) =>
        loc.toLowerCase().includes(val.toLowerCase())
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSelect = (location) => {
    setQuery(location)
    setShowSuggestions(false)
    onSelect?.(location)
  }

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        disabled={disabled}
        onFocus={() => query.length > 2 && setShowSuggestions(true)}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
            >
              <div className="text-sm font-medium">{suggestion}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
