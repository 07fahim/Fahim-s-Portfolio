import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Facebook, Send, CheckCircle, AlertCircle } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'faiyazfahim743@gmail.com',
      href: 'mailto:faiyazfahim743@gmail.com',
      color: '#a78bfa',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+880 1852153575',
      href: 'tel:+8801852153575',
      color: '#22d3ee',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/fahim-faiyaz',
      href: 'https://www.linkedin.com/in/fahim-faiyaz',
      color: '#818cf8',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/07fahim',
      href: 'https://github.com/07fahim',
      color: '#c4b5fd',
    },
    {
      icon: Facebook,
      label: 'Facebook',
      value: 'facebook.com/fahim.faiyaz.16',
      href: 'https://www.facebook.com/fahim.faiyaz.16',
      color: '#60a5fa',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Chittagong, Bangladesh',
      href: '#',
      color: '#67e8f9',
    },
  ];

  return (
    <section id="contact" className="contact-section-new">
      <div className="contact-header">
        <h2 className="contact-title">
          Get In <span className="contact-title-accent">Touch</span>
        </h2>
        <p className="contact-subtitle">
          Open to collaboration, learning opportunities, and small-scale projects. Let's connect!
        </p>
      </div>

      <div className="contact-content">
        {/* Left - Contact Info */}
        <div className="contact-info-side">
          <h3 className="contact-info-title">Contact Information</h3>

          <div className="contact-info-list">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.href}
                target={info.href.startsWith('http') ? '_blank' : undefined}
                rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="contact-info-card"
              >
                <div className="contact-info-icon" style={{ borderColor: info.color }}>
                  <info.icon size={20} style={{ color: info.color }} />
                </div>
                <div className="contact-info-text">
                  <span className="contact-info-label">{info.label}</span>
                  <span className="contact-info-value">{info.value}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="contact-availability">
            <div className="availability-dot"></div>
            <span className="availability-text">Available for Opportunities</span>
          </div>
          <p className="availability-desc">
            Currently open to internships, freelance projects, and collaboration opportunities in AI/ML and Data Science.
          </p>
        </div>

        {/* Right - Contact Form */}
        <div className="contact-form-side">
          <h3 className="contact-form-title">Send a Message</h3>

          <form className="contact-form-new" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Your Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                placeholder="How can I help?"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                placeholder="Your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="form-textarea"
              />
            </div>

            <button
              type="submit"
              className="contact-submit-btn"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                'Sending...'
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>

            {status === 'success' && (
              <div className="form-status success">
                <CheckCircle size={16} />
                Message sent successfully!
              </div>
            )}

            {status === 'error' && (
              <div className="form-status error">
                <AlertCircle size={16} />
                Failed to send message. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
