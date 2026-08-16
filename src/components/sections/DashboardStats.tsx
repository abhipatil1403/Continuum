import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import { dashboardStats } from '../../data/mockData';
import type { DashboardStat } from '../../data/types';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useCountUp(target: number, inView: boolean, duration = 1200) {
  const [value, setValue] = useState(0);
  const isDecimal = target % 1 !== 0;

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf: number;

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(eased * target);
      if (progress < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, inView, duration]);

  return isDecimal ? value.toFixed(2) : Math.round(value).toString();
}

function TrendIcon({ trend }: { trend?: DashboardStat['trend'] }) {
  if (trend === 'up') return <FiTrendingUp className="text-accent-emerald" size={16} />;
  if (trend === 'down') return <FiTrendingDown className="text-accent-warning" size={16} />;
  return <FiMinus className="text-text-secondary" size={16} />;
}

function StatCard({ stat, index }: { stat: DashboardStat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const displayed = useCountUp(stat.value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease, delay: Math.min(index, 5) * 0.06 }}
      className="bg-surface rounded-xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
        <TrendIcon trend={stat.trend} />
      </div>
      <p className="text-4xl font-bold text-text-primary tracking-tight tabular-nums">
        {displayed}
        {stat.suffix && <span className="text-lg text-text-secondary ml-1">{stat.suffix}</span>}
      </p>
      {stat.description && (
        <p className="mt-2 text-sm text-text-secondary">{stat.description}</p>
      )}
    </motion.div>
  );
}

export default function DashboardStats() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
        Dashboard
      </h1>
      <p className="mt-3 text-base text-text-secondary leading-relaxed max-w-2xl">
        A snapshot of your academic journey at VIT Pune — B.Tech CSE (AI &amp; ML).
      </p>

      {/* 2-column on small, 3-column on large — first two cards span wider on md */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardStats.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} index={i} />
        ))}
      </div>
    </section>
  );
}
