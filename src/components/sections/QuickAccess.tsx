import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const sections = [
  {
    to: '/dashboard',
    title: 'Dashboard',
    description: 'GPA trends, subject counts, and a summary of four years at a glance.',
  },
  {
    to: '/timeline',
    title: 'Timeline',
    description: 'Semester-by-semester breakdown of subjects, grades, and key documents.',
  },
  {
    to: '/archive',
    title: 'Archive',
    description: 'Filterable collection of notes, assignments, reports, and certificates.',
  },
  {
    to: '/gallery',
    title: 'Gallery',
    description: 'Photos from hackathons, campus events, and project presentations.',
  },
  {
    to: '/achievements',
    title: 'Achievements',
    description: 'Internships, hackathon wins, certifications, and published work.',
  },
  {
    to: '/projects',
    title: 'Projects',
    description: 'Full-stack applications, ML models, and systems programming.',
  },
];

/**
 * Landing-page section: text-based navigation grid.
 * No icons, no cards — just strong typography and concise descriptions.
 * Asymmetric 2-column + 3-column layout for visual interest.
 */
export default function QuickAccess() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="bg-bg-secondary">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <motion.h2
          className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease }}
        >
          Explore
        </motion.h2>

        {/* Asymmetric grid: 2 cols top, 3 cols bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
          {sections.map((section, i) => (
            <motion.div
              key={section.to}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, ease, delay: 0.1 + i * 0.05 }}
            >
              <Link
                to={section.to}
                className="group block bg-bg-secondary p-6 h-full hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {section.title}
                  </h3>
                  <FiArrowUpRight
                    size={16}
                    className="text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-1"
                  />
                </div>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {section.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
