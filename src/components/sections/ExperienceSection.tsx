import { Briefcase, GraduationCap, Award, Calendar } from 'lucide-react';

interface TimelineItem {
  id: number;
  year: string;
  title: string;
  organization: string;
  description: string;
  type: 'work' | 'education' | 'award';
}

const ExperienceSection = () => {
  const timelineItems: TimelineItem[] = [
    {
      id: 1,
      year: 'Dec 2024 - Present',
      title: 'Computer Vision Engineer',
      organization: 'Quantigo AI',
      description: 'Developing cutting-edge computer vision solutions using YOLOv10/v11, OpenCV, and deep learning frameworks. Working on object detection, image classification, and segmentation tasks for various industry applications.',
      type: 'work',
    },
    {
      id: 2,
      year: '2025',
      title: 'Data Science Career Program (Cohort 7)',
      organization: 'Dokkho MasterCourse',
      description: 'Selected through a task-based assessment; trained to build end-to-end data science projects and completed 4 industry-focused capstone projects.',
      type: 'education',
    },
    {
      id: 3,
      year: '2025',
      title: 'Continuous Learning - Generative AI',
      organization: 'Self-Learning & Research',
      description: 'Exploring advanced Generative AI areas including Large Language Models (LLM), Retrieval-Augmented Generation (RAG), Vision Language Models (VLM), and workflow automation with N8N.',
      type: 'education',
    },
    {
      id: 4,
      year: '2024',
      title: 'IEEE Paper Published - ICCIT 2024',
      organization: 'A Hybrid Deep Learning Approach For Brain Tumor Detection Using XAI with Grad-CAM',
      description: 'Published first IEEE research paper on brain tumor detection combining hybrid deep learning models with Explainable AI (XAI) using Grad-CAM for interpretable medical imaging.',
      type: 'award',
    },
    {
      id: 5,
      year: '2024',
      title: 'Mobile App Development with Flutter',
      organization: 'Ostad',
      description: 'Gained practical experience building cross-platform mobile apps using Flutter and Dart. Developed multiple production-ready applications with modern UI/UX.',
      type: 'education',
    },
    {
      id: 6,
      year: '2024',
      title: 'Gained Interest in AI/ML',
      organization: 'Career Milestone',
      description: 'Started deep diving into Artificial Intelligence and Machine Learning. Began research in Computer Vision and Medical AI applications.',
      type: 'award',
    },
    {
      id: 7,
      year: '2020 - 2024',
      title: 'B.Sc. in Computer Science & Engineering',
      organization: 'East Delta University, Chittagong',
      description: 'Graduated with CGPA 3.60/4.00. Started coding journey, specialized in AI/ML, and completed research projects in computer vision and deep learning.',
      type: 'education',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'work':
        return <Briefcase size={20} />;
      case 'education':
        return <GraduationCap size={20} />;
      case 'award':
        return <Award size={20} />;
      default:
        return <Calendar size={20} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'work':
        return 'var(--color-primary)';
      case 'education':
        return 'var(--color-accent)';
      case 'award':
        return '#FFD700';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'work':
        return 'Experience';
      case 'education':
        return 'Education';
      case 'award':
        return 'Achievement';
      default:
        return '';
    }
  };

  return (
    <section id="experience" className="timeline-wrap-new">
      <div className="timeline-header">
        <h2 className="timeline-title">Experience & Education</h2>
        <p className="timeline-subtitle">
          My professional journey and academic background
        </p>
      </div>

      <div className="timeline-container">
        <div className="timeline-line"></div>
        
        {timelineItems.map((item, index) => (
          <div 
            key={item.id} 
            className={`timeline-item-new ${index % 2 === 0 ? 'left' : 'right'}`}
          >
            <div 
              className="timeline-dot"
              style={{ borderColor: getColor(item.type) }}
            >
              <span style={{ color: getColor(item.type) }}>
                {getIcon(item.type)}
              </span>
            </div>

            <div className="timeline-year-badge">
              {item.year}
            </div>

            <div className="timeline-card-new">
              <div className="timeline-card-header">
                <h3 className="timeline-card-title">{item.title}</h3>
                <span 
                  className="timeline-card-type"
                  style={{ color: getColor(item.type), borderColor: getColor(item.type) }}
                >
                  {getTypeLabel(item.type)}
                </span>
              </div>
              <p style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                {item.organization}
              </p>
              <p className="timeline-card-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
