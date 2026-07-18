import { Link } from 'react-router-dom';
import Logo from './Logo';
import NewsletterForm from './NewsletterForm';
import { contactInfo, socialLinks } from '../lib/content';

export default function Footer() {
  return (
    <footer className="bg-navy-700 text-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="[&_span]:text-white [&_span.text-sky-500]:text-sky-400" />
          <p className="mt-4 text-sm text-white/70">
            Turn your pain into purpose. A UK Community Interest Company supporting postpartum mothers with identity,
            purpose, healing, and reproductive & mental health programs.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wide text-sky-400">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/programs" className="hover:text-white">Our Programs</Link></li>
            <li><Link to="/volunteer" className="hover:text-white">Volunteer</Link></li>
            <li><Link to="/donate" className="hover:text-white">Donate</Link></li>
            <li><Link to="/events" className="hover:text-white">Events</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wide text-sky-400">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><a href={`mailto:${contactInfo.email}`} className="hover:text-white">{contactInfo.email}</a></li>
            <li><a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:text-white">{contactInfo.phone}</a></li>
          </ul>
          <div className="mt-4 flex gap-3 text-sm text-white/80">
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
            <a href={socialLinks.tiktok} target="_blank" rel="noreferrer" className="hover:text-white">TikTok</a>
            <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="hover:text-white">YouTube</a>
          </div>
          <a href={socialLinks.community} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-sky-400 hover:text-sky-300">
            Join our community →
          </a>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wide text-sky-400">Stay Connected</h4>
          <p className="mt-4 mb-2 text-sm text-white/70">Get updates on events, programs, and stories of hope.</p>
          <NewsletterForm variant="footer" />
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Purpose In Pain Initiative CIC. All rights reserved.</p>
          <p>
            <Link to="/admin/login" className="hover:text-white/80">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
