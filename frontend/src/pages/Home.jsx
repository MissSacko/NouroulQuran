import Hero from '../components/Hero'
import AboutSection from '../components/AboutSection'
import ValuesSection from '../components/ValuesSection'
import ActivitiesSection from '../components/ActivitiesSection'
import FeaturedSession from '../components/FeaturedSession'
import SoireesPreview from '../components/SoireesPreview'
import SeriesPreview from '../components/SeriesPreview'
import GallerySection from '../components/GallerySection'
import TeamSection from '../components/TeamSection'
import ContactSection from '../components/ContactSection'

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <AboutSection />
        <ValuesSection />
        <ActivitiesSection />
        <FeaturedSession />
        <SoireesPreview />
        <SeriesPreview />
        <GallerySection />
        <TeamSection />
        <ContactSection />
      </main>
    </>
  )
}
