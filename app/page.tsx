import Background from '@/components/Background';
import Header from '@/components/Header';
import Intro from '@/components/Intro';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <>
      <Background />
      <Header />
      <Intro />
      <main><Hero /></main>
    </>
  );
}
