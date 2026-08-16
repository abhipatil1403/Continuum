import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { semesters } from '../../data/mockData';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Landing-page-only section: a compact horizontal bar showing all semesters
 * with SGPA as a proportional bar height. Clicking links to /timeline.
 * Layout is data-driven and unique — not card grids.
 */
export default function JourneyOverview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  // Normalize SGPA to a 0-1 range for bar heights (min 6, max 10)
  const minSgpa = 6;
  const maxSgpa = 10;

  const completedCount = semesters.filter(s => s.status !== 'in-progress').length;
  const gridCols = semesters.length <= 5 ? `grid-cols-${semesters.length}` : 'grid-cols-4 md:grid-cols-8';

  return (
    <section ref={ref} className="bg-bg-secondary">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease }}
        >
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
                The Journey
              </h2>
              <p className="mt-2 text-base text-text-secondary leading-relaxed max-w-lg">
                {completedCount} semesters completed — from fundamentals to AI &amp; ML specialization.
              </p>
            </div>
            <Link
              to="/timeline"
              className="hidden md:inline-flex text-sm text-accent hover:text-accent/80 transition-colors font-medium"
            >
              Full Timeline →
            </Link>
          </div>
        </motion.div>

        {/* Horizontal semester bar chart */}
        <div className={`grid ${gridCols} gap-3`}>
          {semesters.map((sem, i) => {
            const sgpa = sem.sgpa ?? 0;
            const normalized = sgpa > 0 ? (sgpa - minSgpa) / (maxSgpa - minSgpa) : 0.3;
            const barHeight = 40 + normalized * 80; // 40px min, 120px max
            const isInProgress = sem.status === 'in-progress';

            return (
              <motion.div
                key={sem.id}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, ease, delay: Math.min(i, 5) * 0.06 }}
                className="flex flex-col items-center"
              >
                {/* SGPA value */}
                <p className={`text-sm font-semibold tabular-nums mb-2 ${
                  isInProgress ? 'text-accent-emerald' : 'text-text-primary'
                }`}>
                  {isInProgress ? '●' : sgpa > 0 ? sgpa.toFixed(1) : '—'}
                </p>

                {/* Bar */}
                <motion.div
                  className={`w-full max-w-[40px] rounded-t-lg ${
                    isInProgress ? 'bg-accent-emerald/20' : 'bg-accent/15'
                  }`}
                  initial={{ height: 0 }}
                  animate={inView ? { height: isInProgress ? 50 : barHeight } : {}}
                  transition={{ duration: 0.6, ease, delay: 0.2 + i * 0.06 }}
                />

                {/* Semester label */}
                <div className="mt-3 text-center">
                  <p className={`text-xs font-medium ${
                    isInProgress ? 'text-accent-emerald' : 'text-text-secondary'
                  }`}>
                    Sem {sem.number}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <Link
          to="/timeline"
          className="md:hidden inline-flex mt-8 text-sm text-accent hover:text-accent/80 transition-colors font-medium"
        >
          Full Timeline →
        </Link>
      </div>
    </section>
  );
}
