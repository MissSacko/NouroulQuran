import { Search } from 'lucide-react'

export default function FilterBar({ filters, active, onChange }) {
  return (
    <div className="filter-bar">
      {filters.map((item) => (
        <button
          key={item}
          className={active === item ? 'active' : ''}
          onClick={() => onChange(item)}
        >
          <Search size={14} /> {item}
        </button>
      ))}
    </div>
  )
}
