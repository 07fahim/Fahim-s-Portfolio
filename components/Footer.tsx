import { Mail } from 'lucide-react';
import { SITE } from '@/content/site';
import { Github, Linkedin, Mask } from './icons';

const LINKS = [['WhatsApp', SITE.whatsapp, <Mask key="i" name="whatsapp" />], ['Email', 'mailto:' + SITE.email, <Mail key="i" />], ['LinkedIn', SITE.linkedin, <Linkedin key="i" />], ['GitHub', SITE.github, <Github key="i" />], ['Upwork', SITE.upwork, <Mask key="i" name="upwork" />], ['Fiverr', SITE.fiverr, <Mask key="i" name="fiverr" />]] as const;
const EVENT: Record<string, string> = { [SITE.whatsapp]: 'whatsapp_click', [SITE.upwork]: 'upwork_click', [SITE.fiverr]: 'fiverr_click' };

export default function Footer() {
  // ponytail: the year is fixed at build time; every content edit rebuilds, add a client clock only if a year passes without one
  const year = new Date().getFullYear();
  return (
    <footer className="ft v3" id="footer">
      <div className="f3">
        <div><span className="name silver">FAHIM FAIYAZ</span><p className="line">You bring the problem. <b>I build the AI that solves it.</b></p><span className="avail">Available for freelance work</span></div>
        <div className="icons">{LINKS.map(([n, u, i]) => <a key={n} href={u} aria-label={n} title={n} data-umami-event={EVENT[u]} {...(u.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}>{i}</a>)}</div>
      </div>
      <div className="bar"><span>© {year} Fahim Faiyaz</span><a href="#">Back to top&nbsp;<span aria-hidden="true">↑</span></a></div>
    </footer>
  );
}
