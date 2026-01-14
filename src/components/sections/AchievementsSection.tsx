import { useState } from 'react';
import { Trophy, FileText, ExternalLink } from 'lucide-react';

type AchievementType = 'all' | 'publication' | 'course';

interface Achievement {
    id: number;
    type: 'publication' | 'course';
    title: string;
    venue?: string;
    year: string;
    link?: string;
}

const AchievementsSection = () => {
    const [activeFilter, setActiveFilter] = useState<AchievementType>('all');

    const achievements: Achievement[] = [
        {
            id: 1,
            type: 'publication',
            title: 'Deep Learning for Brain Tumor Detection Leveraging YOLOv10 for Precise Localization',
            venue: 'IEEE RAAICON 2024',
            year: '2024',
            link: '#',
        },
        {
            id: 2,
            type: 'publication',
            title: 'A Hybrid Deep Learning Approach For Brain Tumor Detection Using XAI with Grad-CAM',
            venue: 'ICCIT 2024',
            year: '2024',
            link: '#',
        },
        {
            id: 3,
            type: 'publication',
            title: 'Hybrid Xception–LSTM Model for Explainable Mango Ripeness Classification Using Grad-CAM',
            venue: 'IEEE RAAICON 2025',
            year: '2025',
            link: '#',
        },
        {
            id: 4,
            type: 'publication',
            title: 'Tea Leaf Disease Detection and Classification Using YOLOv11 and Transfer Learning with Grad-CAM',
            venue: 'ICCIT 2025',
            year: '2025',
            link: '#',
        },
        {
            id: 5,
            type: 'publication',
            title: 'Deep Learning Approaches for Distracted Driving Detection Using YOLOv10-S and EfficientNet-B0',
            venue: 'ICCIT 2025',
            year: '2025',
            link: '#',
        },
        {
            id: 6,
            type: 'publication',
            title: 'Tea Leaf Disease Detection Using Explainable AI & the Fusion of Ensemble and Deep Learning',
            venue: 'ICCIT 2025',
            year: '2025',
            link: '#',
        },
        {
            id: 7,
            type: 'course',
            title: 'Dokkho MasterCourse — Data Science Career Program (Cohort 7)',
            year: '2025',
        },
        {
            id: 8,
            type: 'course',
            title: 'Complete Machine Learning & NLP Bootcamp + MLOps Deployment — Udemy',
            year: '2024',
        },
        {
            id: 9,
            type: 'course',
            title: 'Generative AI with LangChain & HuggingFace — Udemy',
            year: '2024',
        },
        {
            id: 10,
            type: 'course',
            title: 'App Development with Flutter — Ostad',
            year: '2024',
        },
    ];

    const filters: { id: AchievementType; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'publication', label: 'Publications' },
        { id: 'course', label: 'Courses' },
    ];

    const filteredAchievements = activeFilter === 'all'
        ? achievements
        : achievements.filter(a => a.type === activeFilter);

    return (
        <section id="achievements" className="achievements-section">
            <div className="achievements-header">
                <h2 className="achievements-title">Achievements & Certificates</h2>
                <p className="achievements-subtitle">
                    Milestones and recognitions throughout my journey
                </p>
            </div>

            <div className="achievements-filters">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        className={`achievement-filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter.id)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="achievements-grid">
                {filteredAchievements.map((achievement) => (
                    <div key={achievement.id} className="achievement-card">
                        <div className="achievement-icon-wrapper">
                            {achievement.type === 'publication' ? (
                                <FileText size={22} className="achievement-icon" />
                            ) : (
                                <Trophy size={22} className="achievement-icon" />
                            )}
                        </div>

                        <span className="achievement-type">
                            {achievement.type === 'publication' ? 'PUBLICATION' : 'COURSE'}
                        </span>

                        <h3 className="achievement-card-title">{achievement.title}</h3>

                        {achievement.venue && (
                            <span className="achievement-venue">• {achievement.venue}</span>
                        )}

                        <div className="achievement-footer">
                            <span className="achievement-year">{achievement.year}</span>
                            {achievement.link && (
                                <a
                                    href={achievement.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="achievement-link"
                                >
                                    <ExternalLink size={14} />
                                    View Paper
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AchievementsSection;
