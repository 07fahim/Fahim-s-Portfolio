import { useState } from 'react';
import { Github, ExternalLink, Brain, Smartphone, Eye, MessageSquare, BarChart3, Leaf, Car, Home } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  type: string;
  description: string;
  image: string;
  technologies: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  category: string;
}

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects: Project[] = [
    {
      id: 1,
      title: 'Brain Tumor Detection with YOLOv10 & Hybrid CNN',
      type: 'Medical AI / Computer Vision',
      description: 'Advanced brain tumor detection system using YOLOv10 and Hybrid CNN models with Explainable AI (XAI) using GradCAM. Published in IEEE RAAICON 2024 and ICCIT 2024.',
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80',
      technologies: ['Python', 'YOLOv10', 'TensorFlow', 'GradCAM', 'XAI'],
      github: 'https://github.com/07fahim/Brain-Tumor-Detection-using-YOLOv10-and-Hybrid-CNN-Models-with-Explainable-AI',
      featured: true,
      category: 'ai',
    },
    {
      id: 2,
      title: 'EmailCraft-AI: Multi-Agent B2B Cold Email Generation System',
      type: 'LLM / Multi-Agent AI',
      description: 'Production-grade multi-agent AI system for personalized, high-conversion B2B cold outreach emails. Integrated RAG pipelines, persona analysis, job-post scraping, portfolio matching, and automated quality evaluation; deployed via API + Docker.',
      image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&q=80',
      technologies: ['Python', 'FastAPI', 'Groq (LLaMA)', 'ChromaDB', 'Pinecone', 'SQLite', 'Docker'],
      github: 'https://github.com/07fahim/EmailCraft-AI',
      featured: true,
      category: 'ai',
    },
    {
      id: 3,
      title: 'Advanced Multi-Agent AI Fitness Coach',
      type: 'LLM / AI Agents',
      description: 'Multi-agent system with intelligent routing for personalized fitness and nutrition guidance. Implemented context-aware conversational AI with memory persistence.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
      technologies: ['Python', 'Streamlit', 'LangChain', 'Groq AI', 'AstraDB'],
      github: 'https://github.com/07fahim/Advanced-Multi-Agent-AI-Fitness-Coach',
      featured: true,
      category: 'ai',
    },
    {
      id: 4,
      title: 'Driver Distraction Detection (Real-Time Computer Vision System)',
      type: 'Computer Vision / Safety AI',
      description: 'YOLOv10-based real-time detection system identifying 12 driver distraction behaviors with 98.1% mAP@50. Optimized inference with ONNX Runtime and automated CI/CD.',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
      technologies: ['Python', 'YOLOv10', 'ONNX Runtime', 'Flask', 'Gradio', 'Docker'],
      github: 'https://github.com/07fahim/Driver-Distraction-Detection-and-Classification',
      featured: true,
      category: 'ai',
    },
    {
      id: 5,
      title: 'Computer Science Research Article Classification',
      type: 'NLP / Multi-Label Classification',
      description: 'Engineered custom dataset of ~30,000 arXiv papers via automated scraping. Achieved 97.4% accuracy using SciBERT; exported models to ONNX and deployed.',
      image: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=600&q=80',
      technologies: ['Python', 'SciBERT', 'FastAI', 'ONNX', 'Flask', 'Selenium', 'Docker'],
      github: 'https://github.com/07fahim/Multi-Label-Text-Classification-of-Computer-Science-Research-Articles',
      featured: true,
      category: 'ai',
    },
    {
      id: 6,
      title: 'Bangladeshi Landmarks Recognition',
      type: 'Computer Vision / Deep Learning',
      description: 'Built a self-scraped dataset of 16,741 images using DuckDuckGo and FastAI tools. Achieved 99.9% accuracy using DenseNet121; deployed via Gradio on Hugging Face.',
      image: '/bangladesh.jpg',
      technologies: ['Python', 'FastAI', 'PyTorch', 'DenseNet121', 'Gradio'],
      github: 'https://github.com/07fahim/Popular-Bangladeshi-Landmarks-Recognizer',
      featured: true,
      category: 'ai',
    },
    {
      id: 7,
      title: 'FIFA Player Analytics (2012–2025)',
      type: 'Data Analytics / Web Scraping',
      description: 'Scraped 14 years of FIFA player data for rating, wage, and market-value trends. Built automated scraping scripts and interactive Tableau dashboards.',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
      technologies: ['Python', 'Selenium', 'Pandas', 'Tableau', 'Jupyter'],
      github: 'https://github.com/07fahim/Top-FIFA-Players-Analysis-2012-2025',
      featured: true,
      category: 'ai',
    },
    {
      id: 8,
      title: 'King County House Price Predictor',
      type: 'Machine Learning / Web App',
      description: 'XGBoost-based regression system with real-time FastAPI endpoints. Containerized deployment using Docker + CI/CD.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      technologies: ['Python', 'XGBoost', 'FastAPI', 'Docker', 'GitHub Actions'],
      github: 'https://github.com/07fahim/king-county-house-price-predictor',
      featured: true,
      category: 'ai',
    },
    {
      id: 9,
      title: 'Mango Ripeness Classification with XAI',
      type: 'Computer Vision / XAI',
      description: 'Hybrid Xception–LSTM architecture achieving 98–99% accuracy on 6,000-image dataset. Applied Grad-CAM explainability for interpretable predictions.',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80',
      technologies: ['Python', 'TensorFlow', 'Xception', 'LSTM', 'Grad-CAM'],
      github: 'https://github.com/07fahim/Mango-Ripeness-Classification-with-GradCam',
      featured: true,
      category: 'ai',
    },
    {
      id: 10,
      title: 'TODO Flutter App',
      type: 'Mobile App / Flutter',
      description: 'A clean and intuitive task management application built with Flutter. Features include task creation, completion tracking, and a modern Material Design UI.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
      technologies: ['Flutter', 'Dart', 'Material Design'],
      github: 'https://github.com/07fahim/TODO-Flutter-App',
      featured: true,
      category: 'mobile',
    },
    {
      id: 11,
      title: 'Task Manager App',
      type: 'Mobile App / Flutter',
      description: 'A comprehensive task management application with advanced features for organizing, prioritizing, and tracking tasks efficiently.',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80',
      technologies: ['Flutter', 'Dart', 'State Management'],
      github: 'https://github.com/07fahim/task_manager',
      featured: true,
      category: 'mobile',
    },
    {
      id: 12,
      title: 'Crafty Bay - Flutter E-commerce App',
      type: 'Mobile App / E-commerce',
      description: 'A full-featured e-commerce mobile application with product browsing, cart management, user authentication, and seamless checkout experience.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80',
      technologies: ['Flutter', 'Dart', 'Firebase', 'REST API'],
      github: 'https://github.com/07fahim/Crafty-Bay-Flutter-E-commerce-app',
      featured: true,
      category: 'mobile',
    },
  ];

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'ai', label: 'AI & ML' },
    { id: 'mobile', label: 'Mobile Apps' },
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const getProjectIcon = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('llm') || typeLower.includes('agent') || typeLower.includes('nlp')) {
      return <MessageSquare size={16} />;
    }
    if (typeLower.includes('medical') || typeLower.includes('brain') || typeLower.includes('tumor')) {
      return <Brain size={16} />;
    }
    if (typeLower.includes('mobile') || typeLower.includes('flutter')) {
      return <Smartphone size={16} />;
    }
    if (typeLower.includes('analytics') || typeLower.includes('data')) {
      return <BarChart3 size={16} />;
    }
    if (typeLower.includes('mango') || typeLower.includes('tea') || typeLower.includes('leaf') || typeLower.includes('ripeness')) {
      return <Leaf size={16} />;
    }
    if (typeLower.includes('driver') || typeLower.includes('driving') || typeLower.includes('safety')) {
      return <Car size={16} />;
    }
    if (typeLower.includes('house') || typeLower.includes('price') || typeLower.includes('predictor')) {
      return <Home size={16} />;
    }
    if (typeLower.includes('vision') || typeLower.includes('detection') || typeLower.includes('landmark')) {
      return <Eye size={16} />;
    }
    return <Brain size={16} />;
  };

  return (
    <section id="projects" className="projects-wrap-new">
      <div className="projects-header">
        <h2 className="projects-title">Featured Projects</h2>
        <p className="projects-subtitle">
          A collection of my work in AI, computer vision, and mobile development
        </p>
      </div>

      <div className="projects-filters-new">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`filter-btn-new ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="projects-bento-grid">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`project-card-new ${project.featured ? 'featured' : ''}`}
          >
            <div className="project-image-wrapper">
              <img
                src={project.image}
                alt={project.title}
                className="project-image"
              />
              <div className="project-overlay">
                <div className="project-overlay-content">
                  <h3 className="project-overlay-title">{project.title}</h3>
                  <p className="project-overlay-desc">{project.description}</p>
                  <div className="project-links">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <Github size={14} />
                        Code
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <ExternalLink size={14} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="project-content">
              <span className="project-type">
                {getProjectIcon(project.type)}
                {project.type}
              </span>
              <h3 className="project-title">{project.title}</h3>
              <div className="project-tech-stack">
                {project.technologies.slice(0, 4).map((tech, idx) => (
                  <span key={idx} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
