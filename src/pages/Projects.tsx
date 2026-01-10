import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'Hybrid Deep Learning Brain Tumor Detection',
    description:
      'Advanced brain tumor detection system combining VGG19 and LSTM architectures with GradCAM visualization. Achieved 98% accuracy in classifying multiple tumor types.',
    skills: [
      'VGG19',
      'LSTM',
      'GradCAM',
      'TensorFlow',
      'Python',
      'Medical Imaging',
    ],
    github: 'https://github.com/07fahim',
    accuracy: '98%',
    highlight: true,
  },
  {
    title: 'YOLOv10 Multi-class Tumor Detection',
    description:
      'Real-time brain tumor detection and classification using YOLOv10 architecture. Published at IEEE RAAICON 2024 conference.',
    skills: [
      'YOLOv10',
      'PyTorch',
      'Computer Vision',
      'Deep Learning',
      'Research',
    ],
    github: 'https://github.com/07fahim',
    published: 'IEEE RAAICON 2024',
    highlight: true,
  },
  {
    title: 'Mango Ripeness Classification',
    description:
      'Intelligent mango ripeness detection system using Xception architecture with LSTM and Grad-CAM. Achieved 98% classification accuracy for agricultural applications.',
    skills: ['Xception', 'LSTM', 'Grad-CAM', 'TensorFlow', 'Agriculture AI'],
    github: 'https://github.com/07fahim',
    accuracy: '98%',
  },
  {
    title: 'Fine-Tuned Skin Disease Detection',
    description:
      'Medical-grade skin disease detection system fine-tuned on YOLOv8 and YOLOv11 models. Enables accurate classification of various dermatological conditions.',
    skills: ['YOLOv8', 'YOLOv11', 'Transfer Learning', 'PyTorch', 'Medical AI'],
    github: 'https://github.com/07fahim',
  },
  {
    title: 'Color and Object Detection',
    description:
      'Real-time color and object detection application built with OpenCV and Tkinter. Features an intuitive GUI for live video processing and analysis.',
    skills: [
      'OpenCV',
      'Tkinter',
      'Python',
      'Computer Vision',
      'GUI Development',
    ],
    github: 'https://github.com/07fahim',
  },
];

export function Projects() {
  return (
    <div className='py-16 w-full'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full'
      >
        <h1 className='text-4xl md:text-5xl font-bold mb-8 text-center'>
          My Projects
        </h1>
        <p className='text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-center'>
          A collection of my work in machine learning, computer vision, and
          mobile development. Each project showcases different aspects of my
          technical expertise and problem-solving approach.
        </p>

        <div className='grid md:grid-cols-2 gap-6'>
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`h-full flex flex-col ${
                  project.highlight ? 'border-primary border-2' : ''
                }`}
              >
                <CardHeader>
                  <div className='flex items-start justify-between gap-4'>
                    <CardTitle className='text-xl'>{project.title}</CardTitle>
                    {project.highlight && (
                      <Badge variant='default'>Featured</Badge>
                    )}
                  </div>
                  <CardDescription className='text-base leading-relaxed'>
                    {project.description}
                  </CardDescription>
                  {(project.accuracy || project.published) && (
                    <div className='flex gap-2 pt-2'>
                      {project.accuracy && (
                        <Badge variant='secondary'>
                          Accuracy: {project.accuracy}
                        </Badge>
                      )}
                      {project.published && (
                        <Badge variant='secondary'>{project.published}</Badge>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent className='flex-1'>
                  <div className='flex flex-wrap gap-2'>
                    {project.skills.map((skill) => (
                      <Badge key={skill} variant='outline'>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className='flex gap-2'>
                  <Button variant='outline' size='sm' asChild>
                    <a
                      href={project.github}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Github className='h-4 w-4' />
                      View Code
                    </a>
                  </Button>
                  <Button variant='ghost' size='sm' asChild>
                    <a
                      href={project.github}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <ExternalLink className='h-4 w-4' />
                      Details
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
