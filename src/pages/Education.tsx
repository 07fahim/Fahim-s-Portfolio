import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';

const highlights = [
  'Specialized in Artificial Intelligence and Machine Learning',
  'Conducted research on deep learning applications in medical imaging',
  'Published paper on brain tumor detection using YOLOv10',
  'Developed multiple ML projects including image classification and object detection',
  'Strong foundation in algorithms, data structures, and software engineering',
];

const relevantCourses = [
  'Artificial Intelligence',
  'Machine Learning',
  'Deep Learning',
  'Computer Vision',
  'Natural Language Processing',
  'Data Structures & Algorithms',
  'Database Management Systems',
  'Software Engineering',
];

export function Education() {
  return (
    <div className='py-16 w-full'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full'
      >
        <h1 className='text-4xl md:text-5xl font-bold mb-8 text-center'>
          Education
        </h1>

        <div className='max-w-4xl mx-auto'>
          <Card className='border-l-4 border-l-primary'>
            <CardHeader>
              <div className='flex items-start gap-4 mb-4'>
                <div className='p-3 bg-primary/10 rounded-lg'>
                  <GraduationCap className='h-8 w-8 text-primary' />
                </div>
                <div className='flex-1'>
                  <CardTitle className='text-2xl mb-2'>
                    Bachelor of Science in Computer Science and Engineering
                  </CardTitle>
                  <CardDescription className='text-lg font-semibold text-foreground'>
                    East Delta University
                  </CardDescription>
                  <div className='flex flex-wrap gap-4 mt-3'>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <Calendar className='h-4 w-4' />
                      <span>2020 – 2024</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <MapPin className='h-4 w-4' />
                      <span>Bangladesh</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <div className='flex items-center gap-2 mb-3'>
                  <Award className='h-5 w-5 text-primary' />
                  <h3 className='text-lg font-semibold'>Highlights</h3>
                </div>
                <ul className='space-y-2'>
                  {highlights.map((highlight, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className='flex items-start gap-2 text-muted-foreground'
                    >
                      <span className='text-primary mt-1.5'>•</span>
                      <span>{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-3'>
                  Relevant Coursework
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {relevantCourses.map((course, index) => (
                    <motion.div
                      key={course}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    >
                      <Badge variant='secondary'>{course}</Badge>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className='pt-4 border-t'>
                <p className='text-muted-foreground'>
                  During my undergraduate studies, I developed a strong
                  foundation in computer science fundamentals while specializing
                  in artificial intelligence and machine learning. My academic
                  journey culminated in research contributions to the field of
                  medical imaging and deep learning, with a focus on practical
                  applications of AI in healthcare.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
