import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Navigation />
      <main className='flex-1'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='w-full flex flex-col'>
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
