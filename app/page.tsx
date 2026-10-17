import About from '@/components/About';
import Achievements from '@/components/Achievements';
import Background from '@/components/Background';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Game from '@/components/Game';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import Services from '@/components/Services';
import Timeline from '@/components/Timeline';
import Work from '@/components/Work';

export default function Home() {
  return (
    <>
      <Background />
      <Header />
      <Intro />
      <main>
        <Hero />
        <About />
        <Services />
        <Work />
        <Timeline />
        <Achievements />
        <Contact />
        <Game />
      </main>
      <Footer />
    </>
  );
}
