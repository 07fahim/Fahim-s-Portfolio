import Background from '@/components/Background';
import Header from '@/components/Header';
import Intro from '@/components/Intro';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Work from '@/components/Work';

export default function Home() {
  return (
    <>
      <Background />
      <Header />
      <Intro />
      <main><Hero /><About /><Services /><Work /></main>
    </>
  );
}
