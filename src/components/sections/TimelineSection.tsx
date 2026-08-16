import React, { memo, useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { semesters } from '../../data/mockData';
import type { Semester } from '../../data/types';
import Badge from '../ui/Badge';

// Helper icons matching design
const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const BookOpen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const FileText = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const Star = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

interface SemesterItemContentProps {
  semester: Semester;
}

const SemesterItemContent = memo(function SemesterItemContent({ semester }: SemesterItemContentProps) {
  return (
    <div className="mt-6 space-y-6 animate-in slide-in-from-top-1 duration-200">
      {/* Subjects */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-text-secondary" />
          <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Subjects &amp; Coursework ({semester.subjects.length})
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {semester.subjects.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-bg-primary/60 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="min-w-0 pr-2">
                <p className="text-sm font-medium text-text-primary truncate">{s.name}</p>
                <p className="text-xs text-text-secondary">{s.code} · {s.credits} credits</p>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase shrink-0">
                {s.category}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      {semester.documents.length > 0 && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-text-secondary" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Archived Documents ({semester.documents.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {semester.documents.map((d) => (
              <Badge key={d.id} variant="default" className="text-xs py-1 px-2.5 flex items-center gap-1.5 border border-white/10">
                <span className="text-text-primary font-medium">{d.title}</span>
                <span className="text-[10px] text-accent uppercase font-bold">({d.type})</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Highlights */}
      {semester.highlights.length > 0 && (
        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-accent" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Semester Highlights
            </h4>
          </div>
          {semester.highlights.map((h, idx) => (
            <div key={idx} className="flex items-start gap-3 group">
              <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
              <p className="text-sm text-text-secondary leading-relaxed">{h}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

SemesterItemContent.displayName = 'SemesterItemContent';

interface TimelineItemProps {
  semester: Semester;
  expanded: boolean;
  onToggle: (id: string) => void;
}

const TimelineItem = memo(function TimelineItem({ semester, expanded, onToggle }: TimelineItemProps) {
  const headerId = `timeline-header-${semester.id}`;
  const contentId = `timeline-content-${semester.id}`;
  const isInProgress = semester.status === 'in-progress';

  return (
    <div className="relative group">
      {/* Connecting line with gradient */}
      <div className="absolute left-6 top-14 bottom-0 w-[2px] bg-gradient-to-b from-accent via-border to-transparent" />

      {/* Timeline node */}
      <div className={`absolute left-4 top-6 w-4 h-4 bg-bg-primary border-2 ${
        isInProgress ? 'border-accent-emerald' : 'border-accent'
      } rounded-full flex items-center justify-center transform transition-all duration-200 z-10`}>
        <div className={`w-2 h-2 ${
          isInProgress ? 'bg-accent-emerald animate-pulse' : 'bg-accent opacity-0 group-hover:opacity-100'
        } rounded-full transition-opacity duration-200`} />
      </div>

      {/* Main content card */}
      <div className="ml-12 mb-8">
        <div
          className={`
          bg-surface 
          rounded-xl border ${isInProgress ? 'border-accent-emerald/40 ring-1 ring-accent-emerald/20' : 'border-border'} 
          transition-all duration-200
          ${expanded ? 'shadow-md' : 'shadow-none hover:shadow-sm'}
        `}
        >
          {/* Header */}
          <button
            id={headerId}
            className="w-full text-left p-6 group/button cursor-pointer hover:bg-surface-hover transition-colors duration-200 rounded-t-xl"
            onClick={() => onToggle(semester.id)}
            aria-expanded={expanded}
            aria-controls={contentId}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-bg-primary rounded-md border border-border">
                    <BookOpen className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary">
                    {semester.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 ml-11 flex-wrap">
                  {isInProgress ? (
                    <Badge variant="warning">● In Progress</Badge>
                  ) : semester.sgpa != null ? (
                    <Badge variant="accent">SGPA {semester.sgpa.toFixed(2)}</Badge>
                  ) : (
                    <Badge variant="default">Completed</Badge>
                  )}
                  <span className="text-xs text-text-secondary">
                    {semester.dateRange}
                  </span>
                </div>
              </div>

              <div
                className={`
                text-text-secondary 
                transition-transform duration-200
                ${expanded ? 'rotate-180' : ''}
              `}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Expandable content */}
          {expanded && (
            <div
              id={contentId}
              role="region"
              aria-labelledby={headerId}
              className="px-6 pb-6 border-t border-border"
            >
              <SemesterItemContent semester={semester} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

TimelineItem.displayName = 'TimelineItem';

export default function TimelineSection() {
  const initial = semesters.map((s) => s.id);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(initial));

  const onToggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const completedCount = semesters.filter((s) => s.status !== 'in-progress').length;
  const inProgressCount = semesters.filter((s) => s.status === 'in-progress').length;

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-3">
          Academic Timeline
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed">
          {completedCount} semesters completed{inProgressCount > 0 ? `, ${inProgressCount} in progress` : ''} at VIT Pune — detailed coursework, subjects, archived files, and key highlights.
        </p>
      </header>

      <div className="relative">
        <AnimatePresence>
          {semesters.map((sem) => (
            <TimelineItem
              key={sem.id}
              semester={sem}
              expanded={expanded.has(sem.id)}
              onToggle={onToggle}
            />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
