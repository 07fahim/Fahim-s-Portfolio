import { Settings } from 'lucide-react';

const AboutSection = () => {
  const stats = [
    { value: '5', label: 'IEEE Publication' },
    { value: '33+', label: 'GitHub Repos' },
    { value: '3.60', label: 'CGPA' },

  ];

  const expertise = [
    {
      title: 'Artificial Intelligence & Machine Learning',
      points: [
        'Deep learning architectures, transfer learning, and model optimization',
        'Designing, training, and deploying production-ready AI/ML models',
      ],
      tech: 'TensorFlow · PyTorch · Keras · Ultralytics',
    },
    {
      title: 'Computer Vision',
      points: [
        'Object detection, image classification, image segmentation, and medical imaging',
        'Real-time vision systems and performance-optimized inference',
      ],
      tech: 'YOLOv10/v11 · OpenCV · Ultralytics',
    },
    {
      title: 'Explainable AI (XAI)',
      points: [
        'Interpretable and transparent AI decision-making for critical applications',
        'Model visualization and post-hoc explainability techniques',
      ],
      tech: 'Grad-CAM · SHAP · LIME',
    },
    {
      title: 'NLP, LLMs & AI Agents',
      points: [
        'Text classification, semantic search, and RAG pipelines',
        'LLM-powered applications, prompt engineering, and AI agent workflows',
      ],
      tech: 'LangChain · Hugging Face · Transformers · Vector DBs',
    },
    {
      title: 'AI Application Development & Deployment',
      points: [
        'Building and deploying AI-powered applications and services',
        'RESTful APIs and interactive AI interfaces for model inference',
      ],
      tech: 'FastAPI · Flask · Gradio · Hugging Face Spaces',
    },
    {
      title: 'Data Science & Predictive Analytics',
      points: [
        'Data analysis, feature engineering, and predictive modeling',
        'Insight-driven visualization and reporting',
      ],
      tech: 'Pandas · Scikit-learn · Tableau',
    },
    {
      title: 'Mobile Application Development',
      points: [
        'Cross-platform mobile applications with modern, user-centric UI/UX',
      ],
      tech: 'Flutter · Dart · Firebase',
    },
  ];

  return (
    <section id="about" className="about-wrap">
      <div className="about-card">
        <div className="about-icon">
          <Settings className="icon-spin" />
        </div>

        <h2>About Me</h2>

        <p className="lead">
          I'm <strong>Gazi Mohammad Fahim Faiyaz</strong>, a Data Scientist and AI/ML Engineer from Chattogram, Bangladesh,
          specializing in Deep Learning, Computer Vision, and Natural Language Processing. I focus on building
          impact-driven AI systems and conducting applied research in predictive modeling and intelligent decision-making.
        </p>

        <p className="lead" style={{ marginTop: '1rem' }}>
          My expertise lies in Artificial Intelligence and Machine Learning, with a strong focus on deep learning–based
          systems. I have hands-on experience in object detection, Medical AI, and Explainable AI (XAI), using TensorFlow,
          PyTorch, and Ultralytics (YOLO) to design, train, optimize, and deploy production-ready AI models for real-world applications.
        </p>

        <p className="lead" style={{ marginTop: '1rem' }}>
          In addition, I have experience in Flutter-based mobile application development, creating cross-platform
          applications with modern, user-centric UI/UX. I am currently expanding my work into Generative AI and AI
          agent systems, exploring multi-agent architectures, retrieval-augmented generation (RAG), and intelligent automation.
        </p>

        <div className="stats-row">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h1>{stat.value}</h1>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>

        <h3 className="expertise-title">Areas of Expertise</h3>

        <div className="expertise-grid">
          {expertise.map((item, index) => (
            <div key={index} className="expert-card">
              <h4>{item.title}</h4>
              <ul className="expert-points">
                {item.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
              <div className="expert-tech">
                <span className="tech-label">Technologies:</span> {item.tech}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
