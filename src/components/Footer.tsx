import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t bg-background/90'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
          <p className='text-sm text-muted-foreground'>
            © {currentYear} Fahim Faiyaz. All rights reserved.
          </p>
          <div className='flex items-center gap-4'>
            <a
              href='https://github.com/07fahim'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-primary transition-colors'
              aria-label='GitHub'
            >
              <Github className='h-5 w-5' />
            </a>
            <a
              href='https://linkedin.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-primary transition-colors'
              aria-label='LinkedIn'
            >
              <Linkedin className='h-5 w-5' />
            </a>
            <a
              href='mailto:contact@fahimfaiyaz.com'
              className='text-muted-foreground hover:text-primary transition-colors'
              aria-label='Email'
            >
              <Mail className='h-5 w-5' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
