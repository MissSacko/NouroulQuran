export default function SectionTitle({ eyebrow, title, text, action }) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="serif">{title}</h2>
      </div>
      <div className="section-head-right">
        {text && <p>{text}</p>}
        {action}
      </div>
    </div>
  )
}
