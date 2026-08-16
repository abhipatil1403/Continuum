import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { projects } from '../data/mockData';
import type { Project } from '../data/types';
import Badge from '../components/ui/Badge';
import PageWrapper from '../components/layout/PageWrapper';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function statusVariant(status: Project['status']) {
  if (status === 'completed') return 'success' as const;
  if (status === 'in-progress') return 'warning' as const;
  return 'default' as const;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const isEven = index % 2 === 0;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease }}
      className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${
        !isEven ? 'md:direction-rtl' : ''
      }`}
    >
      {/* Project Image / Placeholder */}
      <div
        className={`bg-surface rounded-xl border border-border aspect-[16/10] overflow-hidden flex items-center justify-center relative group ${
          !isEven ? 'md:order-2' : ''
        }`}
      >
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <p className="text-sm text-text-secondary font-medium">{project.title}</p>
        )}
      </div>

      {/* Content */}
      <div className={!isEven ? 'md:order-1' : ''}>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={statusVariant(project.status)}>{project.status}</Badge>
          <span className="text-xs text-text-secondary">Semester {project.semesterNumber}</span>
        </div>

        <h3 className="text-lg font-semibold text-text-primary">{project.title}</h3>

        <p className="mt-3 text-base text-text-secondary leading-relaxed max-w-2xl">
          {project.longDescription}
        </p>

        {/* Tech badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        {/* Links */}
        <div className="mt-5 flex items-center gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <FiGithub size={15} />
              Source
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              <FiExternalLink size={15} />
              Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <PageWrapper>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
          Projects
        </h1>
        <p className="mt-3 text-base text-text-secondary leading-relaxed max-w-2xl">
          Ten projects spanning web development, machine learning, IoT, and
          mobile applications — built across five semesters.
        </p>

        <div className="mt-16 space-y-20">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
