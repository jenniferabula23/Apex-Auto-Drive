import { Link } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://web.facebook.com/share/1Xnzth6PyZ/',
    Icon: Facebook,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/apexautodrive?igsh=MTJkbXdjODFmdTU4Mw%3D%3D&utm_source=qr',
    Icon: Instagram,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@apexautodrive?_r=1&_t=ZS-96YLSevWRy3',
    Icon: TikTokIcon,
  },
];

const openingHours = [
  { day: 'Monday – Friday', hours: '8:00 AM – 4:00 PM' },
  { day: 'Saturday', hours: '9:00 AM – 3:00 PM' },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="inline-block mb-6">
              <img
                src="/photo_2026-05-13_21-54-50-removebg-preview.png"
                alt="Apex Auto Drive"
                className="h-10 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 0 8px rgba(174,33,25,0.4))' }}
              />
            </Link>
            <p className="text-brand-gray text-sm leading-relaxed mb-6">
              Reliable car rental and transportation services in Accra — self-drive and chauffeur options for business, travel, and everyday mobility.
            </p>
            <p className="text-xs text-brand-gray uppercase tracking-widest mb-3">Follow Us</p>
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-brand-gray hover:text-white hover:border-brand-red/50 hover:bg-brand-red/10 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white mb-6 tracking-wide">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Vehicles', path: '/vehicles' },
                { label: 'About Us', path: '/about' },
                { label: 'Services', path: '/services' },
                { label: 'Contact Us', path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-brand-gray hover:text-brand-red text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white mb-6 tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-red" />
              Opening Hours
            </h4>
            <ul className="space-y-3">
              {openingHours.map(({ day, hours }) => (
                <li key={day} className="text-sm">
                  <span className="text-white block">{day}</span>
                  <span className="text-brand-gray">{hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white mb-6 tracking-wide">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-red mt-0.5 flex-shrink-0" />
                <span className="text-brand-gray text-sm">
                  Dansoman Roundabout
                  <br />
                  <span className="text-white/80">GU-537-3000</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-red mt-0.5 flex-shrink-0" />
                <span className="text-brand-gray text-sm">
                  <a href="tel:+233544124090" className="hover:text-white transition-colors block">
                    0544 124 090
                  </a>
                  <a href="tel:+233544123796" className="hover:text-white transition-colors block mt-1">
                    0544 123 796
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-red flex-shrink-0" />
                <a
                  href="mailto:info@apexautodrive.co"
                  className="text-brand-gray text-sm hover:text-white transition-colors"
                >
                  info@apexautodrive.co
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-brand-gray text-sm">
            &copy; {new Date().getFullYear()} Apex Auto Drive. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-brand-gray hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-brand-gray hover:text-white text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
