import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiCornerDownLeft } from 'react-icons/fi';
import { useSearch } from '../../hooks/useSearch';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function SearchSpotlight() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const results = useSearch(query);

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset active index on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleSelect = useCallback(
    (route: string) => {
      setOpen(false);
      navigate(route);
    },
    [navigate],
  );

  // Keyboard navigation
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      handleSelect(results[activeIndex].route);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-bg-primary/70"
            onClick={() => setOpen(false)}
          />

          {/* Spotlight */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease }}
            className="fixed z-[101] top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-lg"
          >
            <div className="bg-surface rounded-xl border border-border shadow-soft overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <FiSearch size={16} className="text-text-secondary shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search semesters, projects, documents..."
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none"
                  aria-label="Search"
                />
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-text-secondary bg-bg-secondary rounded border border-border">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              {query.trim() && (
                <div className="max-h-72 overflow-y-auto py-2" role="listbox">
                  {results.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-text-secondary">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                  ) : (
                    results.map((r, i) => (
                      <button
                        key={r.id}
                        role="option"
                        aria-selected={i === activeIndex}
                        onClick={() => handleSelect(r.route)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${
                          i === activeIndex ? 'bg-surface-hover' : ''
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-text-primary truncate">{r.title}</p>
                          {r.description && (
                            <p className="text-xs text-text-secondary truncate mt-0.5">
                              {r.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] uppercase tracking-wider text-text-secondary font-medium">
                            {r.category}
                          </span>
                          {i === activeIndex && (
                            <FiCornerDownLeft size={12} className="text-text-secondary" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Footer hint */}
              {!query.trim() && (
                <div className="px-4 py-3 text-xs text-text-secondary">
                  Type to search across all semesters, projects, documents, and achievements.
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
