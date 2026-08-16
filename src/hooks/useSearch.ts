import type {
  Project,
  Achievement,
  Certificate,
  Semester,
  Document,
  GalleryItem,
} from '../data/types';
import {
  semesters,
  projects,
  achievements,
  certificates,
  galleryItems,
  allDocuments,
} from '../data/mockData';

export interface SearchResult {
  id: string;
  title: string;
  category: string;
  description?: string;
  route: string;
}

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;

  // character-by-character fuzzy: every char in query appears in order in text
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

function matchesQuery(query: string, ...fields: (string | undefined)[]): boolean {
  return fields.some((f) => f && fuzzyMatch(query, f));
}

export function useSearch(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];
  const q = query.trim();

  // Semesters
  semesters.forEach((s: Semester) => {
    if (matchesQuery(q, s.title, s.dateRange, ...s.subjects.map((sub) => sub.name))) {
      results.push({
        id: s.id,
        title: s.title,
        category: 'Semester',
        description: `${s.dateRange} · SGPA ${s.sgpa}`,
        route: '/timeline',
      });
    }
  });

  // Projects
  projects.forEach((p: Project) => {
    if (matchesQuery(q, p.title, p.description, ...p.techStack)) {
      results.push({
        id: p.id,
        title: p.title,
        category: 'Project',
        description: p.description,
        route: '/projects',
      });
    }
  });

  // Documents
  allDocuments.forEach((d: Document) => {
    if (matchesQuery(q, d.title, d.type, d.subjectName)) {
      results.push({
        id: d.id,
        title: d.title,
        category: 'Document',
        description: `${d.type} · ${d.subjectName ?? ''}`,
        route: '/archive',
      });
    }
  });

  // Achievements
  achievements.forEach((a: Achievement) => {
    if (matchesQuery(q, a.title, a.organization, a.description, a.type)) {
      results.push({
        id: a.id,
        title: a.title,
        category: 'Achievement',
        description: a.organization,
        route: '/achievements',
      });
    }
  });

  // Certificates
  certificates.forEach((c: Certificate) => {
    if (matchesQuery(q, c.title, c.issuer, c.category)) {
      results.push({
        id: c.id,
        title: c.title,
        category: 'Certificate',
        description: c.issuer,
        route: '/archive',
      });
    }
  });

  // Gallery
  galleryItems.forEach((g: GalleryItem) => {
    if (matchesQuery(q, g.title, g.location, g.category)) {
      results.push({
        id: g.id,
        title: g.title,
        category: 'Gallery',
        description: g.location,
        route: '/gallery',
      });
    }
  });

  return results;
}
