import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { galleryItems } from '../data/mockData';
import type { GalleryItem } from '../data/types';
import PageWrapper from '../components/layout/PageWrapper';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease, delay: Math.min(index, 5) * 0.06 }}
      className="group relative rounded-xl overflow-hidden bg-surface border border-border aspect-[16/10]"
    >
      {/* Image or fallback placeholder */}
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-text-secondary font-medium text-center px-4">
            {item.title}
          </p>
        </div>
      )}

      {/* Permanent subtle dark gradient + Strong Black shadow/overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Hover overlay — title, semester, date, location */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
        <p className="text-base font-bold text-white drop-shadow-md leading-tight">{item.title}</p>
        <p className="mt-1.5 text-xs font-medium text-gray-200 drop-shadow">
          Semester {item.semester} · {item.location}
        </p>
        <p className="text-xs text-gray-300/90 drop-shadow">
          {new Date(item.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
          })}
        </p>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  return (
    <PageWrapper>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
          Gallery
        </h1>
        <p className="mt-3 text-base text-text-secondary leading-relaxed max-w-2xl">
          Moments from hackathons, events, and campus life.
        </p>

        {/* Responsive Wide Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, i) => (
            <GalleryCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
