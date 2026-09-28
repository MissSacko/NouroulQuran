export default function PageHeaderr({ eyebrow, title, text }) {
  return (
    <header className="page-header">
      <div className="container">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="serif">{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </header>
  )
}
