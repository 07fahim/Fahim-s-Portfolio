import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Mail, Linkedin, Github } from 'lucide-react';

export function Contact() {
  return (
    <div className='py-16 w-full'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full'
      >
        <h1 className='text-4xl md:text-5xl font-bold mb-4 text-center'>
          Get In Touch
        </h1>
        <p className='text-muted-foreground mb-12 max-w-3xl mx-auto text-center'>
          I'm always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision. Feel free to connect with me
          through the channels below.
        </p>

        <div className='max-w-2xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='space-y-6'
          >
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Connect with me through these channels
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <a
                  href='mailto:contact@fahimfaiyaz.com'
                  className='flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group'
                >
                  <div className='p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors'>
                    <Mail className='h-5 w-5 text-primary' />
                  </div>
                  <div className='flex flex-col items-start'>
                    <div className='font-medium'>Email</div>
                    <div className='text-sm text-muted-foreground'>
                      contact@fahimfaiyaz.com
                    </div>
                  </div>
                </a>

                <a
                  href='https://github.com/07fahim'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group'
                >
                  <div className='p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors'>
                    <Github className='h-5 w-5 text-primary' />
                  </div>
                  <div className='flex flex-col items-start'>
                    <div className='font-medium'>GitHub</div>
                    <div className='text-sm text-muted-foreground'>
                      @07fahim
                    </div>
                  </div>
                </a>

                <a
                  href='https://linkedin.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group'
                >
                  <div className='p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors'>
                    <Linkedin className='h-5 w-5 text-primary' />
                  </div>
                  <div className='flex flex-col items-start'>
                    <div className='font-medium'>LinkedIn</div>
                    <div className='text-sm text-muted-foreground'>
                      Connect with me
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Let's Collaborate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>
                  I'm interested in freelance opportunities, research
                  collaborations, and full-time positions in AI/ML, computer
                  vision, and mobile development. If you have an exciting
                  project or opportunity, let's connect!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
