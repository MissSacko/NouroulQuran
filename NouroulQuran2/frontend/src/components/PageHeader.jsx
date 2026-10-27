import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PageHeader({ eyebrow, title, text, back }) {
  return (
    <header className="page-header">
      <div className="container">
        {back && (
          <Link to={back.to} className="page-back">
            <ChevronDown size={14} className="page-back-icon" /> {back.label}
          </Link>
        )}
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="serif">{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </header>
  )
}
