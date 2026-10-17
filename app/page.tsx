import Background from '@/components/Background';
import Header from '@/components/Header';
import Intro from '@/components/Intro';
import Hero from '@/components/Hero';
import About from '@/components/About';

export default function Home() {
  return (
    <>
      <Background />
      <Header />
      <Intro />
      <main><Hero /><About /></main>
    </>
  );
}
