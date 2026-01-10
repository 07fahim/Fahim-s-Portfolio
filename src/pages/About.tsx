import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, GraduationCap } from 'lucide-react';

const timelineItems = [
  {
    type: 'work',
    title: 'Computer Vision Research Engineer',
    organization: 'Quantigo AI',
    period: 'Apr 2025 – Present',
    description:
      'Research & development in Computer Vision, building scalable ML models and AI systems.',
    icon: Briefcase,
  },
  {
    type: 'education',
    title: 'Bachelor of Science in Computer Science and Engineering',
    organization: 'East Delta University',
    period: '2020 – 2024',
    description: 'Focused on Machine Learning, Deep Learning, and AI research.',
    icon: GraduationCap,
  },
];

export function About() {
  return (
    <div className='py-16 w-full'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full'
      >
        <h1 className='text-4xl md:text-5xl font-bold mb-8 text-center'>
          About Me
        </h1>

        <div className='max-w-4xl mx-auto space-y-6 text-muted-foreground leading-relaxed mb-16 text-center'>
          <p className='text-lg'>
            I am a passionate Computer Vision Research Engineer with expertise
            in building scalable AI systems and developing mobile applications.
            My work focuses on advancing machine learning models and creating
            innovative solutions in computer vision and natural language
            processing.
          </p>

          <div className='grid md:grid-cols-2 gap-6 my-8'>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-semibold text-foreground mb-3'>
                  Mobile Development
                </h3>
                <p>
                  Proficient in Flutter framework for building cross-platform
                  applications. Experienced in developing Android and iOS apps
                  with clean architecture and modern UI/UX principles.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-semibold text-foreground mb-3'>
                  Machine Learning
                </h3>
                <p>
                  Specialized in deep learning, computer vision, and NLP.
                  Hands-on experience with YOLOv8, YOLOv10, TensorFlow, and
                  PyTorch for building state-of-the-art AI models.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-semibold text-foreground mb-3'>
                  Data Science
                </h3>
                <p>
                  Strong foundation in data analysis, visualization, and
                  statistical modeling. Proficient with NumPy, Pandas,
                  Matplotlib, and scikit-learn for extracting insights from
                  complex datasets.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-semibold text-foreground mb-3'>
                  Research
                </h3>
                <p>
                  Published researcher with focus on brain tumor detection using
                  deep learning. Contributed to IEEE conferences and actively
                  exploring cutting-edge AI research.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <h2 className='text-3xl font-bold mb-8 text-center'>Timeline</h2>
        <div className='max-w-4xl mx-auto'>
          <div className='relative border-l-2 border-primary ml-4 space-y-12'>
            {timelineItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className='relative pl-8'
              >
                <div className='absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center'>
                  <item.icon className='h-3 w-3 text-primary-foreground' />
                </div>
                <Card>
                  <CardContent className='p-6'>
                    <div className='text-sm text-primary font-semibold mb-2'>
                      {item.period}
                    </div>
                    <h3 className='text-xl font-bold mb-1'>{item.title}</h3>
                    <div className='text-muted-foreground font-medium mb-3'>
                      {item.organization}
                    </div>
                    <p className='text-muted-foreground'>{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
