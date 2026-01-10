import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Code,
  Smartphone,
  Brain,
  Database,
  Award,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import dp from '@/assets/dp.png';

const techStack = [
  'Flutter',
  'Python',
  'TensorFlow',
  'PyTorch',
  'YOLOv8',
  'YOLOv10',
  'OpenCV',
  'NLP',
  'Deep Learning',
  'React',
  'JavaScript',
  'Dart',
];

const featuredProjects = [
  {
    title: 'AI-Powered Mobile App',
    description:
      'Flutter app with integrated machine learning models for real-time object detection and classification using YOLOv8.',
    technologies: ['Flutter', 'YOLOv8', 'TensorFlow Lite', 'Python'],
    link: '/projects',
    status: 'Featured',
  },
  {
    title: 'Computer Vision Research',
    description:
      'Advanced deep learning models for image analysis and pattern recognition with published research papers.',
    technologies: ['PyTorch', 'OpenCV', 'Python', 'Deep Learning'],
    link: '/projects',
    status: 'Research',
  },
  {
    title: 'NLP Text Analysis System',
    description:
      'Natural language processing application for sentiment analysis and text classification with high accuracy.',
    technologies: ['Python', 'NLP', 'TensorFlow', 'Scikit-learn'],
    link: '/projects',
    status: 'Production',
  },
];

const skillCategories = [
  {
    category: 'Mobile Development',
    icon: <Smartphone className='h-6 w-6' />,
    skills: ['Flutter', 'Dart', 'Android', 'iOS', 'Firebase', 'REST APIs'],
  },
  {
    category: 'Machine Learning',
    icon: <Brain className='h-6 w-6' />,
    skills: [
      'TensorFlow',
      'PyTorch',
      'YOLOv8',
      'OpenCV',
      'Scikit-learn',
      'Keras',
    ],
  },
  {
    category: 'Programming',
    icon: <Code className='h-6 w-6' />,
    skills: ['Python', 'JavaScript', 'Dart', 'SQL', 'Git', 'Linux'],
  },
  {
    category: 'Data Science',
    icon: <Database className='h-6 w-6' />,
    skills: [
      'Pandas',
      'NumPy',
      'Matplotlib',
      'Data Analysis',
      'Statistics',
      'Visualization',
    ],
  },
];

const achievements = [
  {
    title: 'Published Research Papers',
    description:
      'Contributed to multiple research publications in computer vision and deep learning',
    icon: <Award className='h-5 w-5' />,
  },
  {
    title: 'Mobile App Deployments',
    description:
      'Successfully developed and deployed multiple Flutter applications',
    icon: <Smartphone className='h-5 w-5' />,
  },
  {
    title: 'AI Model Development',
    description:
      'Built and optimized various machine learning models for production use',
    icon: <Brain className='h-5 w-5' />,
  },
];

export function Home() {
  return (
    <div className='w-full'>
      {/* Hero Section */}
      <section className='min-h-[90vh] flex items-center py-16 w-full'>
        <div className='max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-10 items-center px-2'>
          {/* Hero Image - Order first on mobile, second on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='relative flex justify-center order-first md:order-last'
          >
            <div
              className='absolute -inset-6 md:-inset-8 rounded-3xl'
              aria-hidden
            />
            <img
              src={dp}
              alt='Portrait of Fahim Faiyaz'
              className='relative z-10 w-md max-w-md h-[60vh] rounded-3xl object-fill shadow-xl ring-1 ring-border'
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='order-last md:order-first'
          >
            <div className='mb-6'>
              <Badge variant='secondary' className='mb-4 text-sm'>
                Available for Opportunities
              </Badge>
            </div>
            <h1 className='text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>
              Fahim Faiyaz
            </h1>
            <div className='text-xl md:text-2xl text-muted-foreground mb-4 font-medium'>
              Computer Vision Research Engineer & Mobile Developer
            </div>
            <div className='text-lg text-muted-foreground mb-8 max-w-3xl'>
              Specializing in AI-powered mobile applications, deep learning
              research, and scalable machine learning systems. Building the
              future with Flutter and cutting-edge AI.
            </div>
            <div className='flex flex-col sm:flex-row gap-4 sm:justify-start mb-12'>
              <Button size='lg' asChild>
                <a href='/resume.pdf' download className='flex space-x-1'>
                  <Download className='h-5 w-5' />
                  <span>Download Resume</span>
                </a>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <Link to='/projects' className='flex space-x-1'>
                  <span>View Projects</span>
                  <ArrowRight className='h-5 w-5' />
                </Link>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <Link to='/contact' className='flex space-x-1'>
                  <span>Get In Touch</span>
                  <Mail className='h-5 w-5' />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact (under hero for better layout) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='flex flex-wrap justify-center gap-6 text-sm text-muted-foreground'
      >
        <div className='flex items-center gap-2'>
          <MapPin className='h-4 w-4' />
          <span>Dhaka, Bangladesh</span>
        </div>
        <div className='flex items-center gap-2'>
          <Mail className='h-4 w-4' />
          <span>fahim.faiyaz@example.com</span>
        </div>
        <div className='flex items-center gap-2'>
          <Phone className='h-4 w-4' />
          <span>+880 123 456 789</span>
        </div>
      </motion.div>

      {/* About Me Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className='py-20'
      >
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-8'>About Me</h2>
          <div className='grid md:grid-cols-2 gap-8 text-left'>
            <div>
              <p className='text-muted-foreground leading-relaxed mb-6'>
                I'm a passionate Computer Vision Research Engineer with
                expertise in building scalable AI systems and mobile
                applications. My journey spans across mobile app development
                with Flutter, advanced machine learning models, and deep
                learning research.
              </p>
              <p className='text-muted-foreground leading-relaxed'>
                As a published researcher, I have hands-on experience with
                YOLOv8, YOLOv10, natural language processing, and computer
                vision projects. I love solving complex problems and turning
                innovative ideas into real-world applications.
              </p>
            </div>
            <div className='space-y-4'>
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className='flex items-start gap-3'
                >
                  <div className='p-2 bg-primary/10 rounded-lg text-primary'>
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className='font-semibold'>{achievement.title}</h3>
                    <p className='text-sm text-muted-foreground'>
                      {achievement.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Projects Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className='py-20'
      >
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              Featured Projects
            </h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              Showcasing my latest work in AI, mobile development, and research
              projects
            </p>
          </div>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className='h-full hover:shadow-lg transition-shadow duration-300 group'>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <Badge
                        variant={
                          project.status === 'Featured'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {project.status}
                      </Badge>
                      <ExternalLink className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
                    </div>
                    <CardTitle className='group-hover:text-primary transition-colors'>
                      {project.title}
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2 mb-4'>
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant='outline' className='text-xs'>
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      asChild
                      className='p-0 h-auto'
                    >
                      <Link
                        to={project.link}
                        className='flex items-center gap-1 text-primary'
                      >
                        Learn more
                        <ChevronRight className='h-3 w-3' />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className='text-center mt-8'>
            <Button variant='outline' size='lg' asChild>
              <Link to='/projects' className='flex space-x-1'>
                <span>View All Projects</span>
                <ArrowRight className='h-5 w-5' />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className='py-20'
      >
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              Technical Skills
            </h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              My expertise spans across multiple domains in technology and
              software development
            </p>
          </div>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className='h-full'>
                  <CardHeader className='text-center'>
                    <div className='mx-auto p-3 bg-primary/10 rounded-lg text-primary w-fit'>
                      {category.icon}
                    </div>
                    <CardTitle className='text-lg'>
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {category.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant='secondary'
                          className='text-xs'
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tech Stack Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className='py-20'
      >
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-8'>
            Technologies I Work With
          </h2>
          <div className='flex flex-wrap gap-3 justify-center'>
            {techStack.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className='px-4 py-2 bg-secondary rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default'
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className='py-20'
      >
        <Card className='max-w-4xl mx-auto'>
          <CardContent className='p-8 md:p-12 text-center'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              Let's Work Together
            </h2>
            <p className='text-muted-foreground mb-8 max-w-2xl mx-auto'>
              I'm always interested in new opportunities and exciting projects.
              Whether you need a mobile app, AI solution, or research
              collaboration, let's discuss how we can bring your ideas to life.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button size='lg' asChild>
                <Link to='/contact' className='flex space-x-1'>
                  <span>Start a Project</span>
                  <ArrowRight className='h-5 w-5' />
                </Link>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <a
                  href='mailto:fahim.faiyaz@example.com'
                  className='flex space-x-1'
                >
                  <Mail className='h-5 w-5' />
                  <span>Send Email</span>
                </a>
              </Button>
            </div>

            {/* Social Links */}
            <div className='flex justify-center gap-4 mt-8'>
              <Button variant='ghost' size='icon' asChild>
                <a
                  href='https://github.com/fahimfaiyaz'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Github className='h-5 w-5' />
                </a>
              </Button>
              <Button variant='ghost' size='icon' asChild>
                <a
                  href='https://linkedin.com/in/fahimfaiyaz'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Linkedin className='h-5 w-5' />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
