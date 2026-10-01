import { useState } from 'react'
import SectionTitle from './SectionTitle'
import Lightbox from './Lightbox'
import { gallery } from '../data/content'

export default function GallerySection() {
  const [selected, setSelected] = useState(null)

  return (
    <section className="section gallery-section" id="galerie">
      <div className="container">
        <SectionTitle
          eyebrow="La vie du club"
          title="Nos moments"
          text="Quelques instants de partage, d'étude et de fraternité."
        />
        <div className="gallery-grid">
          {gallery.map(([title, image], index) => (
            <button
              className={`gallery-item ${index === 0 ? 'large' : ''}`}
              key={title}
              onClick={() => setSelected({ title, image })}
            >
              <img src={image} alt={title} />
              <span>{title}</span>
            </button>
          ))}
        </div>
      </div>
      <Lightbox image={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
