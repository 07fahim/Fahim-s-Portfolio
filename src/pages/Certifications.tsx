import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, Building } from 'lucide-react';

const certifications = [
  {
    title: 'Deep Learning for Brain Tumor Detection Leveraging YOLOv10',
    issuer: 'Bangladesh University of Engineering and Technology (BUET)',
    date: 'November 2024',
    description:
      'Advanced certification in applying YOLOv10 architecture for medical imaging and brain tumor detection. Covered deep learning techniques, model optimization, and real-world deployment strategies.',
    skills: [
      'YOLOv10',
      'Deep Learning',
      'Medical Imaging',
      'Computer Vision',
      'PyTorch',
    ],
  },
];

const keySkills = [
  { name: 'Python', level: 'Expert' },
  { name: 'Deep Learning', level: 'Expert' },
  { name: 'TensorFlow', level: 'Advanced' },
  { name: 'PyTorch', level: 'Advanced' },
  { name: 'Computer Vision', level: 'Expert' },
  { name: 'NLP', level: 'Advanced' },
  { name: 'Flutter', level: 'Advanced' },
  { name: 'YOLO (v8, v10, v11)', level: 'Expert' },
];

export function Certifications() {
  return (
    <div className='py-16 w-full'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full'
      >
        <h1 className='text-4xl md:text-5xl font-bold mb-8 text-center'>
          Certifications
        </h1>

        <div className='max-w-4xl mx-auto space-y-8'>
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className='border-l-4 border-l-primary'>
                <CardHeader>
                  <div className='flex items-start gap-4'>
                    <div className='p-3 bg-primary/10 rounded-lg'>
                      <Award className='h-8 w-8 text-primary' />
                    </div>
                    <div className='flex-1'>
                      <CardTitle className='text-xl mb-2'>
                        {cert.title}
                      </CardTitle>
                      <CardDescription className='space-y-2'>
                        <div className='flex items-center gap-2 text-sm'>
                          <Building className='h-4 w-4' />
                          <span className='font-semibold text-foreground'>
                            {cert.issuer}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 text-sm'>
                          <Calendar className='h-4 w-4' />
                          <span>{cert.date}</span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <p className='text-muted-foreground'>{cert.description}</p>
                  <div>
                    <h4 className='text-sm font-semibold mb-2'>
                      Skills Acquired
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {cert.skills.map((skill) => (
                        <Badge key={skill} variant='secondary'>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='mt-12'
          >
            <h2 className='text-3xl font-bold mb-6'>Key Skills</h2>
            <div className='grid md:grid-cols-2 gap-4'>
              {keySkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                >
                  <Card>
                    <CardContent className='p-4'>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold'>{skill.name}</span>
                        <Badge
                          variant={
                            skill.level === 'Expert' ? 'default' : 'secondary'
                          }
                        >
                          {skill.level}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
