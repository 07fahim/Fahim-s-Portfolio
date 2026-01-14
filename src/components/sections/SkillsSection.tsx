import { useEffect, useRef, useState } from 'react';
import { Terminal, Database, Cpu, Cloud, Workflow, BrainCircuit, Server } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: React.ElementType;
  skills: Skill[];
}

const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const categories: SkillCategory[] = [
    {
      title: 'Programming & Tools',
      icon: Terminal,
      skills: [
        { name: 'Python', level: 92 },
        { name: 'C/C++', level: 65 },
        { name: 'SQL (MySQL)', level: 70 },
        { name: 'Git', level: 85 },
        { name: 'Jupyter Notebook', level: 90 },
        { name: 'Tableau', level: 72 },
      ],
    },
    {
      title: 'Databases',
      icon: Database,
      skills: [
        { name: 'MySQL', level: 70 },
        { name: 'ChromaDB', level: 75 },
        { name: 'AstraDB', level: 72 },
        { name: 'Pinecone', level: 70 },
      ],
    },
    {
      title: 'Backend & APIs',
      icon: Server,
      skills: [
        { name: 'FastAPI', level: 82 },
        { name: 'Flask', level: 80 },
        { name: 'Gradio', level: 85 },
      ],
    },
    {
      title: 'AI/ML & Computer Vision',
      icon: Cpu,
      skills: [
        { name: 'Deep Learning', level: 90 },
        { name: 'PyTorch', level: 88 },
        { name: 'TensorFlow/Keras', level: 88 },
        { name: 'Scikit-Learn', level: 85 },
        { name: 'FastAI', level: 82 },
        { name: 'OpenCV', level: 85 },
        { name: 'Ultralytics (YOLO)', level: 92 },
        { name: 'Object Detection', level: 90 },
        { name: 'Image Segmentation', level: 78 },
        { name: 'Explainable AI (XAI)', level: 88 },
      ],
    },
    {
      title: 'NLP & LLMs',
      icon: BrainCircuit,
      skills: [
        { name: 'Transformers', level: 78 },
        { name: 'RAG Pipelines', level: 80 },
        { name: 'Embeddings', level: 78 },
        { name: 'Prompt Engineering', level: 82 },
        { name: 'LangChain', level: 80 },
        { name: 'LangFlow', level: 70 },
      ],
    },
    {
      title: 'Data Engineering',
      icon: Workflow,
      skills: [
        { name: 'Web Scraping', level: 88 },
        { name: 'Selenium', level: 85 },
        { name: 'Data Pipelines', level: 80 },
        { name: 'Data Preprocessing', level: 88 },
      ],
    },
    {
      title: 'MLOps & Cloud',
      icon: Cloud,
      skills: [
        { name: 'Docker', level: 80 },
        { name: 'GitHub Actions', level: 78 },
        { name: 'MLflow', level: 72 },
        { name: 'ONNX Runtime', level: 78 },
        { name: 'Hugging Face Spaces', level: 85 },
        { name: 'Roboflow', level: 82 },
        { name: 'AWS', level: 55 },
        { name: 'Azure', level: 50 },
      ],
    },
  ];

  const orderedCategories = (() => {
    const order = [
      'Programming & Tools',
      'AI/ML & Computer Vision',
      'NLP & LLMs',
      'Databases',
      'MLOps & Cloud',
      'Backend & APIs',
      'Data Engineering'
    ];
    const byTitle = new Map(categories.map((c) => [c.title, c]));
    return order.map((t) => byTitle.get(t)).filter(Boolean) as SkillCategory[];
  })();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="skills-container" ref={sectionRef}>
      <h2 className="skills-title">Technical Skills</h2>
      
      <div className="categories-wrapper">
        {orderedCategories.map((category, catIndex) => {
          const IconComponent = category.icon;
          return (
            <div key={catIndex} className="category-block">
              <div className="category-header">
                <IconComponent className="category-icon" />
                <h3 className="category-title">{category.title}</h3>
              </div>
              
              <div className="skills-grid">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percent">{skill.level}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress"
                        style={{ 
                          width: isVisible ? `${skill.level}%` : '0%',
                          transitionDelay: `${(catIndex * 4 + skillIndex) * 0.1}s`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SkillsSection;
