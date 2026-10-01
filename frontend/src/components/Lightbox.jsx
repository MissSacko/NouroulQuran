import { X } from 'lucide-react'

export default function Lightbox({ image, onClose }) {
  if (!image) return null

  return (
    <div className="lightbox" onClick={onClose}>
      <button onClick={onClose} aria-label="Fermer"><X size={26} /></button>
      <img src={image.image} alt={image.title} onClick={(e) => e.stopPropagation()} />
      <p>{image.title}</p>
    </div>
  )
}
