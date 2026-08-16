import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCommand } from 'react-icons/fi';
import Button from '../ui/Button';
import UiverseAnimation from '../ui/UiverseAnimation';
import { semesters } from '../../data/mockData';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const stagger = 0.06;

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease, delay: i * stagger },
  }),
};

/**
 * Abstract SVG timeline — flowing bezier curve through semester nodes.
 * Each node is positioned along an S-curve, labeled with semester number
 * and SGPA pulled from real data. Line-based, not illustrative.
 */
function TimelineVisualization() {
  // Position nodes along a gentle S-curve for visual interest
  const nodes = semesters.map((sem, i) => {
    const y = 32 + i * 80;
    // S-curve: alternating horizontal offsets via sine
    const x = 90 + Math.sin((i * Math.PI) / 2.5) * 35;
    return { x, y, semester: sem.number, sgpa: sem.sgpa, status: sem.status };
  });

  const svgHeight = 32 + (semesters.length - 1) * 80 + 32;

  // Build a smooth cubic bezier path through all nodes
  const pathParts = nodes.map((n, i) => {
    if (i === 0) return `M ${n.x} ${n.y}`;
    const prev = nodes[i - 1];
    const midY = (prev.y + n.y) / 2;
    return `C ${prev.x} ${midY}, ${n.x} ${midY}, ${n.x} ${n.y}`;
  });

  return (
    <motion.svg
      viewBox={`0 0 200 ${svgHeight}`}
      className="w-full h-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease, delay: stagger * 4 }}
      aria-hidden="true"
    >
      {/* Flowing bezier path */}
      <motion.path
        d={pathParts.join(' ')}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1"
        strokeOpacity="0.2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease, delay: stagger * 5 }}
      />

      {/* Semester nodes with data */}
      {nodes.map((n, i) => (
        <g key={n.semester}>
          {/* Outer ring — pulsing for in-progress */}
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={6}
            fill="none"
            stroke={n.status === 'in-progress' ? 'var(--accent-emerald)' : 'var(--accent)'}
            strokeWidth="1"
            strokeOpacity={n.status === 'in-progress' ? 0.6 : 0.3}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              n.status === 'in-progress'
                ? { opacity: [0.4, 0.8, 0.4], scale: [1, 1.3, 1] }
                : { opacity: 1, scale: 1 }
            }
            transition={
              n.status === 'in-progress'
                ? { duration: 2, ease: 'easeInOut', repeat: Infinity, delay: stagger * 5 + i * 0.07 }
                : { duration: 0.3, ease, delay: stagger * 5 + i * 0.07 }
            }
          />
          {/* Inner dot */}
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={2.5}
            fill={n.status === 'in-progress' ? 'var(--accent-emerald)' : 'var(--accent)'}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease, delay: stagger * 5 + i * 0.07 }}
          />

          <motion.text
            x={i % 2 === 0 ? n.x + 16 : n.x - 16}
            y={n.y - 4}
            fill="var(--text-primary)"
            fontSize="10"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
            textAnchor={i % 2 === 0 ? 'start' : 'end'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: stagger * 5 + i * 0.07 + 0.1 }}
          >
            Sem {n.semester}
          </motion.text>
          <motion.text
            x={i % 2 === 0 ? n.x + 16 : n.x - 16}
            y={n.y + 9}
            fill={n.status === 'in-progress' ? 'var(--accent-emerald)' : 'var(--accent)'}
            fontSize="9"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
            textAnchor={i % 2 === 0 ? 'start' : 'end'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: stagger * 5 + i * 0.07 + 0.15 }}
          >
            {n.status === 'in-progress' ? 'live' : n.sgpa != null ? `${n.sgpa.toFixed(2)} SGPA` : '—'}
          </motion.text>
        </g>
      ))}
    </motion.svg>
  );
}

export default function Hero() {
  const totalSubjects = semesters.reduce((sum, s) => sum + s.subjects.length, 0);

  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-12 md:gap-20 items-start">
        {/* Text — left-aligned, asymmetric */}
        <div>
          <motion.p
            className="text-sm font-medium text-accent tracking-wider uppercase"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Academic Archive · 2024–Present
          </motion.p>

          <motion.div
            className="mt-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <UiverseAnimation />
          </motion.div>

          <motion.p
            className="mt-6 text-lg text-text-secondary leading-relaxed max-w-xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            B.Tech CSE (AI &amp; ML) at VIT Pune — five semesters, {totalSubjects} subjects,
            ten projects, and seventeen certifications — organized into a
            single, searchable archive.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-3"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <Link to="/archive">
              <Button variant="primary" size="lg">
                Explore Archive
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="secondary" size="lg">
                View Projects
              </Button>
            </Link>
            <a
              href="https://github.com/abhipatil1403"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg" className="gap-2">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub Profile
              </Button>
            </a>
          </motion.div>

          {/* Cmd+K hint — functional, not decorative */}
          <motion.p
            className="mt-6 text-xs text-text-secondary flex items-center gap-1.5"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <FiCommand size={12} />
            Press <kbd className="px-1 py-0.5 text-[10px] font-medium bg-surface rounded border border-border">Ctrl K</kbd> to search anything
          </motion.p>
        </div>

        {/* Timeline visualization — right column */}
        <div className="hidden md:block">
          <TimelineVisualization />
        </div>
      </div>
    </section>
  );
}
