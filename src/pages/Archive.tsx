import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFile, FiDownload } from 'react-icons/fi';
import { allDocuments } from '../data/mockData';
import type { Document } from '../data/types';
import Badge from '../components/ui/Badge';
import PageWrapper from '../components/layout/PageWrapper';
import FolderCard from '../components/ui/FolderCard';
import Modal from '../components/ui/Modal';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const categories = [
  { key: 'all', label: 'All' },
  { key: 'notes', label: 'Notes' },
  { key: 'pdf', label: 'PDFs' },
  { key: 'image', label: 'Images' },
  { key: 'assignment', label: 'Assignments' },
  { key: 'ppt', label: 'PPTs' },
  { key: 'certificate', label: 'Certificates' },
  { key: 'report', label: 'Reports' },
  { key: 'lab-journal', label: 'Lab Journals' },
  { key: 'research', label: 'Research' },
  { key: 'resume', label: 'Resume' },
] as const;

export default function Archive() {
  const [selectedFolder, setSelectedFolder] = useState<{ id: string; label: string; files: Document[] } | null>(null);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const groupedDocs = categories
    .filter(cat => cat.key !== 'all')
    .map(cat => {
      const typeDocs = allDocuments.filter(doc => doc.type === cat.key);
      return {
        id: cat.key,
        label: cat.label,
        files: typeDocs,
      };
    })
    .filter(group => group.files.length > 0);

  return (
    <PageWrapper>
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
            Archive
          </h1>
          <p className="mt-3 text-base text-text-secondary leading-relaxed max-w-2xl">
            A comprehensive collection of academic resources, notes, and research materials.
          </p>
        </div>

        {/* Folder Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 pt-8 pb-20"
        >
          <AnimatePresence mode="popLayout">
            {groupedDocs.map((group, index) => (
              <motion.div
                key={group.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease, delay: Math.min(index, 5) * 0.05 }}
                className="flex flex-col items-center gap-3"
              >
                <FolderCard 
                  label={group.label} 
                  files={group.files} 
                  onOpen={() => setSelectedFolder(group)}
                />
                <span className="text-text-primary font-medium text-sm">{group.label}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {groupedDocs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-text-secondary"
          >
            No documents found for this category.
          </motion.div>
        )}

        {/* Modal for Folder Contents */}
        <Modal
          isOpen={!!selectedFolder}
          onClose={() => setSelectedFolder(null)}
          title={selectedFolder ? `${selectedFolder.label} Documents` : ''}
        >
          {selectedFolder && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedFolder.files.map((file) => (
                <div 
                  key={file.id} 
                  onClick={() => setPreviewDoc(file)}
                  className="bg-surface hover:bg-surface-hover p-4 rounded-xl border border-white/5 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-accent bg-accent/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <FiFile className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" size="sm">{file.date.substring(0,4)}</Badge>
                  </div>
                  <h3 className="font-semibold text-text-primary text-sm line-clamp-2 mb-1 group-hover:text-accent transition-colors">{file.title}</h3>
                  <p className="text-xs text-text-secondary capitalize">{file.type}</p>
                </div>
              ))}
            </div>
          )}
        </Modal>

        {/* Modal for Document Preview */}
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc ? `${previewDoc.type.toUpperCase()} Viewer` : ''}
        >
          {previewDoc && (
            <div className="w-full max-w-3xl mx-auto bg-surface border border-white/10 rounded-2xl p-8 shadow-2xl text-text-primary space-y-6">
              {/* Single Title Header */}
              <div className="border-b border-white/10 pb-6 flex justify-between items-start">
                <div>
                  <Badge variant="accent" className="mb-2">{previewDoc.type.toUpperCase()}</Badge>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary leading-tight tracking-tight">
                    {previewDoc.title}
                  </h2>
                  <p className="text-xs text-accent font-medium mt-2">
                    Course: {previewDoc.subjectName || 'General'} | Semester {previewDoc.semesterId.replace('sem-', '')} | Date: {previewDoc.date}
                  </p>
                </div>
              </div>

              {/* Render Document Body */}
              {previewDoc.type === 'research' || previewDoc.title.includes('Framework') || previewDoc.title.includes('TRAVYA') ? (
                <div className="space-y-6 text-sm text-text-secondary leading-relaxed font-sans">
                  {previewDoc.description ? (
                    <div className="space-y-4">
                      {previewDoc.description.split('\n\n').map((section, idx) => {
                        const lines = section.split('\n');
                        const rawHeader = lines[0]?.trim();

                        if (rawHeader === 'TITLE:') return null;

                        const isHeader = rawHeader && (
                          rawHeader.startsWith('ABSTRACT') || 
                          rawHeader.startsWith('AUTHORS') || 
                          rawHeader.startsWith('METHODOLOGY') || 
                          rawHeader.startsWith('SYSTEM ARCHITECTURE') || 
                          rawHeader.startsWith('RESULTS') || 
                          rawHeader.startsWith('INDEX TERMS') || 
                          rawHeader.startsWith('KEYWORDS')
                        );
                        
                        const headerTitle = isHeader ? rawHeader.replace(':', '').replace('—', ' — ') : '';
                        const contentLines = isHeader ? lines.slice(1).join('\n') : section;

                        return (
                          <div key={idx} className="bg-bg-primary/80 p-5 rounded-xl border border-white/5 space-y-2">
                            {isHeader ? (
                              <>
                                <h4 className="text-xs font-bold text-accent uppercase tracking-wider border-b border-white/10 pb-2">
                                  {headerTitle}
                                </h4>
                                <div className="text-xs text-text-primary font-mono whitespace-pre-wrap leading-relaxed pt-1">
                                  {contentLines}
                                </div>
                              </>
                            ) : (
                              <div className="text-xs text-text-primary font-mono whitespace-pre-wrap leading-relaxed">
                                {section}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-bg-primary/80 p-5 rounded-xl border border-white/5 space-y-2">
                      <h4 className="text-xs font-bold text-accent uppercase tracking-wider border-b border-white/10 pb-2">
                        ABSTRACT
                      </h4>
                      <p className="text-xs text-text-primary font-mono leading-relaxed">
                        Automated research paper documentation prepared for VIT B.Tech CSE (AI &amp; ML).
                      </p>
                    </div>
                  )}
                </div>
              ) : previewDoc.description ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-surface-hover p-3 rounded-lg border border-white/5 text-xs text-text-secondary font-mono">
                    <span>📄 Source: Authentic Student File Archive</span>
                    <span>VIT B.Tech CSE (AI &amp; ML)</span>
                  </div>
                  
                  <pre className="p-5 bg-bg-primary rounded-xl border border-white/10 font-mono text-xs text-text-primary whitespace-pre-wrap leading-relaxed overflow-x-auto shadow-inner">
                    {previewDoc.description}
                  </pre>
                </div>
              ) : previewDoc.type === 'notes' || previewDoc.type === 'pdf' ? (
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed font-sans">
                  <h4 className="text-base font-semibold text-accent uppercase tracking-wider">Module Notes &amp; Summary</h4>
                  <p className="bg-bg-primary/80 p-4 rounded-lg border border-white/5 font-mono text-xs text-text-primary leading-normal">
                    1. Overview &amp; Fundamental Definitions<br/>
                    2. Theoretical Formulations &amp; Governing Equations<br/>
                    3. Practical Engineering Applications &amp; Case Studies<br/>
                    4. Solved Numerical Examples &amp; Exercise Questions
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed font-sans">
                  <h4 className="text-base font-semibold text-accent uppercase tracking-wider">Document Overview</h4>
                  <p className="text-xs text-text-primary font-mono">
                    Verified academic material for {previewDoc.subjectName || 'VIT Coursework'}.
                  </p>
                </div>
              )}

              {/* Actions & Close Button in Modal Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                {previewDoc.fileUrl ? (
                  <a
                    href={previewDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="px-5 py-2 text-sm font-medium rounded-lg bg-accent hover:bg-accent/90 text-bg-primary font-semibold transition-colors inline-flex items-center gap-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    Open / Download File
                  </a>
                ) : (
                  <span className="text-xs text-text-secondary">Academic Record</span>
                )}
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-5 py-2 text-sm font-medium rounded-lg bg-surface hover:bg-surface-hover border border-border text-text-primary transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageWrapper>
  );
}
