import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div>
        <span>© {currentYear} Fahim Faiyaz. Made with </span>
        <Heart size={14} style={{ display: 'inline', color: '#f87171', fill: '#f87171' }} />
        <span> using React & TypeScript</span>
      </div>
      
      <div className="footer-right">
        <a 
          href="https://github.com/07fahim" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <Github size={18} />
        </a>
        <a 
          href="https://www.linkedin.com/in/fahim-faiyaz" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <Linkedin size={18} />
        </a>
        <a 
          href="mailto:faiyazfahim743@gmail.com"
          aria-label="Email"
        >
          <Mail size={18} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
