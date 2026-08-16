import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { projects } from '../../data/mockData';
import Badge from '../ui/Badge';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Landing-page section: shows 3 featured projects as a vertical list
 * with title, one-line description, and tech stack.
 * Layout is a simple stacked list — not the alternating image layout from Projects page.
 */
export default function FeaturedWork() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  // Pick 3 completed projects
  const featured = projects.filter((p) => p.status === 'completed').slice(0, 3);

  return (
    <section ref={ref} className="bg-bg-primary">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease }}
        >
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
                Selected Work
              </h2>
              <p className="mt-2 text-base text-text-secondary leading-relaxed max-w-lg">
                A handful of projects from full-stack systems to machine learning.
              </p>
            </div>
            <Link
              to="/projects"
              className="hidden md:inline-flex text-sm text-accent hover:text-accent/80 transition-colors font-medium"
            >
              All Projects →
            </Link>
          </div>
        </motion.div>

        {/* Stacked list — each project is a row separated by a border */}
        <div className="divide-y divide-border">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease, delay: 0.1 + i * 0.06 }}
              className="py-6 first:pt-0 last:pb-0"
            >
              <Link
                to="/projects"
                className="group flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs text-text-secondary">
                      Sem {project.semesterNumber}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed max-w-2xl">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                    {project.techStack.length > 3 && (
                      <Badge>+{project.techStack.length - 3}</Badge>
                    )}
                  </div>
                  <FiArrowRight
                    size={16}
                    className="text-text-secondary group-hover:text-accent group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <Link
          to="/projects"
          className="md:hidden inline-flex mt-8 text-sm text-accent hover:text-accent/80 transition-colors font-medium"
        >
          All Projects →
        </Link>
      </div>
    </section>
  );
}
