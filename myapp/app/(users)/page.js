import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Collections from './components/Collections';
import Features from './components/Features';
import ContactCTA from './components/ContactCTA';
import Testimonials from './components/Testimonials';
import Categories from './components/Categories';
import StyleDiscover from './components/StyleDiscover';
import PerfectPair from './components/PerfectPair';
import ParallaxCTA from './components/ParallaxCTA';
import Footer from './components/Footer';

export default function Page() {
  return (
    <main className="bg-white">
      <Navbar isWhiteOnLoad={true} />
      <Hero />
      <Collections />
      <Features />
      <ContactCTA />
      <Testimonials />
      <Categories />
      <StyleDiscover />
      <PerfectPair />
      <ParallaxCTA />
      <Footer />
    </main>
  );
}
