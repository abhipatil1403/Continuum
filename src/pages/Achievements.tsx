import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiBriefcase, FiZap, FiAward, FiStar, FiBookOpen } from 'react-icons/fi';
import { achievements } from '../data/mockData';
import type { Achievement } from '../data/types';
import Badge from '../components/ui/Badge';
import PageWrapper from '../components/layout/PageWrapper';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const typeIcons: Record<Achievement['type'], React.ElementType> = {
  internship: FiBriefcase,
  hackathon: FiZap,
  certification: FiAward,
  award: FiStar,
  publication: FiBookOpen,
};

function AchievementEntry({ achievement, index }: { achievement: Achievement; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const Icon = typeIcons[achievement.type];
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease, delay: Math.min(index, 5) * 0.06 }}
      className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8"
    >
      {/* Left content or spacer */}
      <div className={`${isLeft ? 'md:text-right' : 'md:order-3'} ${!isLeft ? 'hidden md:block' : ''}`}>
        {isLeft && (
          <AchievementContent achievement={achievement} Icon={Icon} alignRight />
        )}
      </div>

      {/* Center marker — diamond shape, distinct from semester timeline's circles */}
      <div className="hidden md:flex flex-col items-center">
        <div className="w-8 h-8 rounded-sm rotate-45 bg-surface border border-border flex items-center justify-center shrink-0">
          <Icon size={14} className="text-accent -rotate-45" />
        </div>
        <div className="flex-1 w-px bg-border mt-2" />
      </div>

      {/* Right content or spacer */}
      <div className={`${!isLeft ? '' : 'hidden md:block md:order-3'}`}>
        {!isLeft && (
          <AchievementContent achievement={achievement} Icon={Icon} />
        )}
      </div>

      {/* Mobile-only: always show content */}
      <div className="md:hidden">
        <div className="flex items-start gap-3">
          <div className="mt-1 w-7 h-7 rounded-sm rotate-45 bg-surface border border-border flex items-center justify-center shrink-0">
            <Icon size={12} className="text-accent -rotate-45" />
          </div>
          <AchievementContent achievement={achievement} Icon={Icon} />
        </div>
      </div>
    </motion.div>
  );
}

function AchievementContent({
  achievement,
  alignRight,
}: {
  achievement: Achievement;
  Icon: React.ElementType;
  alignRight?: boolean;
}) {
  return (
    <div className={alignRight ? 'md:ml-auto md:max-w-md' : 'md:max-w-md'}>
      <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">
        {new Date(achievement.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        })}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-text-primary">{achievement.title}</h3>
      <p className="mt-0.5 text-sm text-accent">{achievement.organization}</p>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
        {achievement.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="accent">{achievement.type}</Badge>
        {achievement.location && <Badge>{achievement.location}</Badge>}
        {achievement.tags?.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}

export default function Achievements() {
  return (
    <PageWrapper>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
          Achievements
        </h1>
        <p className="mt-3 text-base text-text-secondary leading-relaxed max-w-2xl">
          Certifications, events, research publications, and innovations earned
          across five semesters at VIT Pune.
        </p>

        <div className="mt-16 space-y-8 md:space-y-12">
          {achievements.map((ach, i) => (
            <AchievementEntry key={ach.id} achievement={ach} index={i} />
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
