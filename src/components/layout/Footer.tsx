import { Link } from 'react-router-dom';

const footerLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/archive', label: 'Archive' },
  { to: '/projects', label: 'Projects' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/achievements', label: 'Achievements' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <p className="text-lg font-bold text-text-primary tracking-tight">
            Continuum
          </p>
          <p className="mt-1 text-sm text-text-secondary max-w-xs">
            A living archive of B.Tech CSE (AI &amp; ML) at VIT Pune — semesters,
            projects, and everything in between.
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-text-secondary">
            Abhishek Patil · VIT Pune · 2024–Present
          </p>
          <a
            href="https://github.com/abhipatil1403"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-secondary hover:text-accent flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            github.com/abhipatil1403
          </a>
        </div>
      </div>
    </footer>
  );
}
