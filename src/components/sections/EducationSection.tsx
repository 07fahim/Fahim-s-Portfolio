import { 
  GraduationCap, 
  Award, 
  Code, 
  Brain, 
  FileText, 
  Smartphone, 
  Briefcase, 
  Sparkles,
  Rocket,
  BookOpen
} from 'lucide-react';

const EducationSection = () => {
  // Complete chronological journey
  const journeyTimeline = [
    {
      year: '2017',
      title: 'SSC (Science)',
      subtitle: 'Lamabazar A.A.S City Corporation High School, Chittagong',
      description: 'Completed Secondary School Certificate with excellent academic record.',
      badge: 'GPA: 5.00',
      type: 'education',
      icon: GraduationCap,
      color: '#4ade80', // green
    },
    {
      year: '2019',
      title: 'HSC (Science)',
      subtitle: 'Chittagong Cantonment Public College',
      description: 'Completed Higher Secondary Certificate with strong performance in science subjects.',
      badge: 'GPA: 4.58',
      type: 'education',
      icon: GraduationCap,
      color: '#60a5fa', // blue
    },
    {
      year: '2020',
      title: 'Started Coding Journey',
      subtitle: 'East Delta University',
      description: 'Began B.Sc. in Computer Science & Engineering. Discovered passion for programming.',
      badge: 'Milestone',
      type: 'milestone',
      icon: Code,
      color: '#f472b6', // pink
    },
    {
      year: '2024',
      title: 'Gained Interest In AI/ML',
      subtitle: 'Deep Learning & Computer Vision',
      description: 'Specialized in Artificial Intelligence, Machine Learning, and Computer Vision technologies.',
      badge: 'Focus Area',
      type: 'milestone',
      icon: Brain,
      color: '#a78bfa', // purple
    },
    {
      year: '2024',
      title: 'IEEE Paper Published',
      subtitle: 'ICCIT 2024',
      description: 'A Hybrid Deep Learning Approach For Brain Tumor Detection Using XAI with Grad-CAM',
      badge: 'Research',
      type: 'publication',
      icon: FileText,
      color: '#fbbf24', // yellow
    },
    {
      year: '2024',
      title: 'Mobile App Development with Flutter',
      subtitle: 'Ostad',
      description: 'Gained practical experience building cross-platform mobile apps using Flutter and Dart.',
      badge: 'Certification',
      type: 'certification',
      icon: Smartphone,
      color: '#34d399', // emerald
    },
    {
      year: '2024',
      title: 'B.Sc. in Computer Science & Engineering',
      subtitle: 'East Delta University',
      description: 'Graduated with specialization in AI/ML and Computer Vision. Research focus: Medical AI and Explainable AI.',
      badge: 'CGPA: 3.60/4.00',
      type: 'education',
      icon: Award,
      color: '#f97316', // orange
    },
    {
      year: 'Dec 2024',
      title: 'Computer Vision Engineer',
      subtitle: 'Quantigo AI',
      description: 'Working on cutting-edge computer vision solutions for real-world applications.',
      badge: 'Present',
      type: 'work',
      icon: Briefcase,
      color: '#22d3ee', // cyan
    },
    {
      year: '2025',
      title: 'Data Science Career Program',
      subtitle: 'Dokkho MasterCourse (Cohort 7)',
      description: 'Selected through task-based assessment; trained to build end-to-end data science projects and completed 4 industry-focused capstone projects.',
      badge: 'Training',
      type: 'certification',
      icon: BookOpen,
      color: '#e879f9', // fuchsia
    },
    {
      year: '2025',
      title: 'Continuous Learning',
      subtitle: 'Generative AI Areas',
      description: 'Exploring LLM, RAG, VLM, N8N and other cutting-edge Generative AI technologies.',
      badge: 'Ongoing',
      type: 'learning',
      icon: Sparkles,
      color: '#c2b280', // sand
    },
  ];

  return (
    <section id="timeline" className="timeline-wrap-new">
      <div className="timeline-header">
        <h2 className="timeline-title">Timeline</h2>
        <p className="timeline-subtitle">
          Education • Milestones • Career • Continuous Learning
        </p>
      </div>

      {/* Tree Timeline */}
      <div className="timeline-container">
        {/* Central Line */}
        <div className="timeline-line"></div>

        {journeyTimeline.map((item, index) => {
          const isLeft = index % 2 === 0;
          const IconComponent = item.icon;

          return (
            <div 
              key={index} 
              className={`timeline-item-new ${isLeft ? 'left' : 'right'}`}
            >
              {/* Year Badge */}
              <div className="timeline-year-badge">
                {item.year}
              </div>

              {/* Center Dot with Icon */}
              <div 
                className="timeline-dot"
                style={{ borderColor: item.color }}
              >
                <IconComponent size={22} style={{ color: item.color }} />
              </div>

              {/* Card */}
              <div className="timeline-card-new">
                <div className="timeline-card-header">
                  <h4 className="timeline-card-title">{item.title}</h4>
                  <span 
                    className="timeline-card-type"
                    style={{ 
                      color: item.color, 
                      border: `1px solid ${item.color}`,
                      background: `${item.color}15`
                    }}
                  >
                    {item.badge}
                  </span>
                </div>
                <p style={{ 
                  color: 'var(--color-primary)', 
                  fontSize: '0.9rem', 
                  marginBottom: '0.5rem',
                  fontWeight: 500 
                }}>
                  {item.subtitle}
                </p>
                <p className="timeline-card-desc">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EducationSection;
