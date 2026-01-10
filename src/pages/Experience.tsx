import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';

const responsibilities = [
  'Conducting advanced research in computer vision and machine learning',
  'Developing and optimizing ML models for production environments',
  'Building scalable AI systems and pipelines',
  'Collaborating with cross-functional teams on AI-driven projects',
  'Implementing state-of-the-art deep learning architectures',
  'Contributing to research papers and technical documentation',
];

const skills = [
  'Computer Vision',
  'Deep Learning',
  'PyTorch',
  'TensorFlow',
  'YOLO',
  'Python',
  'Model Optimization',
  'MLOps',
];

export function Experience() {
  return (
    <div className='py-16 w-full'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full'
      >
        <h1 className='text-4xl md:text-5xl font-bold mb-8 text-center'>
          Experience
        </h1>

        <div className='max-w-4xl mx-auto'>
          <Card className='border-l-4 border-l-primary'>
            <CardHeader>
              <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                <div>
                  <CardTitle className='text-2xl mb-2'>
                    Computer Vision Research Engineer
                  </CardTitle>
                  <CardDescription className='text-lg font-semibold text-foreground'>
                    Quantigo AI
                  </CardDescription>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Calendar className='h-4 w-4' />
                    <span>Apr 2025 – Present</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <MapPin className='h-4 w-4' />
                    <span>Remote</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold mb-3'>
                  Key Responsibilities
                </h3>
                <ul className='space-y-2'>
                  {responsibilities.map((responsibility, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className='flex items-start gap-2 text-muted-foreground'
                    >
                      <span className='text-primary mt-1.5'>•</span>
                      <span>{responsibility}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-3'>
                  Technologies & Skills
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                    >
                      <Badge variant='secondary'>{skill}</Badge>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className='pt-4 border-t'>
                <p className='text-muted-foreground italic'>
                  Working remotely on cutting-edge AI research and development
                  projects, focusing on advancing computer vision technologies
                  and implementing innovative machine learning solutions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
