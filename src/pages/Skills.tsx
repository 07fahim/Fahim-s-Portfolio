import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Cpu, Wrench, Database } from 'lucide-react';

const skillCategories = [
  {
    title: 'Programming Languages',
    icon: Code2,
    skills: ['Python', 'Dart', 'JavaScript', 'TypeScript', 'C++', 'SQL'],
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Frameworks & Libraries',
    icon: Cpu,
    skills: [
      'Flutter',
      'TensorFlow',
      'PyTorch',
      'React',
      'Keras',
      'scikit-learn',
      'OpenCV',
      'NumPy',
      'Pandas',
    ],
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'ML/AI Technologies',
    icon: Database,
    skills: [
      'YOLOv8',
      'YOLOv10',
      'YOLOv11',
      'NLP',
      'Deep Learning',
      'Computer Vision',
      'Transfer Learning',
      'GradCAM',
      'LSTM',
      'CNN',
    ],
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Tools & Platforms',
    icon: Wrench,
    skills: [
      'Git',
      'GitHub',
      'Jupyter',
      'VS Code',
      'Android Studio',
      'Docker',
      'Linux',
      'Matplotlib',
      'Seaborn',
    ],
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

const specializations = [
  {
    area: 'Mobile Development',
    description:
      'Cross-platform app development with Flutter for iOS and Android',
    level: 90,
  },
  {
    area: 'Computer Vision',
    description: 'Object detection, image classification, and medical imaging',
    level: 95,
  },
  {
    area: 'Deep Learning',
    description: 'Neural networks, CNNs, RNNs, and transformer architectures',
    level: 92,
  },
  {
    area: 'Natural Language Processing',
    description: 'Text analysis, sentiment analysis, and language models',
    level: 85,
  },
  {
    area: 'Data Science',
    description: 'Data analysis, visualization, and statistical modeling',
    level: 88,
  },
];

export function Skills() {
  return (
    <div className='py-16 w-full'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full'
      >
        <h1 className='text-4xl md:text-5xl font-bold mb-4 text-center'>
          Skills & Expertise
        </h1>
        <p className='text-muted-foreground mb-12 max-w-3xl mx-auto text-center'>
          A comprehensive overview of my technical skills and specializations in
          software development, artificial intelligence, and machine learning.
        </p>

        <div className='grid md:grid-cols-2 gap-6 mb-16'>
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className='h-full'>
                <CardHeader>
                  <div className='flex items-center gap-3'>
                    <div className={`p-3 rounded-lg ${category.bgColor}`}>
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <CardTitle className='text-xl'>{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.4 + index * 0.1 + skillIndex * 0.05,
                        }}
                      >
                        <Badge
                          variant='secondary'
                          className='text-sm py-1.5 px-3'
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className='text-3xl font-bold mb-6'>Specializations</h2>
          <div className='space-y-6'>
            {specializations.map((spec, index) => (
              <motion.div
                key={spec.area}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <Card>
                  <CardContent className='p-6'>
                    <div className='flex flex-col md:flex-row md:items-center gap-4'>
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold mb-1'>
                          {spec.area}
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                          {spec.description}
                        </p>
                      </div>
                      <div className='w-full md:w-48'>
                        <div className='flex items-center gap-3'>
                          <div className='flex-1 h-2 bg-secondary rounded-full overflow-hidden'>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${spec.level}%` }}
                              transition={{
                                duration: 1,
                                delay: 0.8 + index * 0.1,
                              }}
                              className='h-full bg-primary'
                            />
                          </div>
                          <span className='text-sm font-semibold min-w-[3ch]'>
                            {spec.level}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
