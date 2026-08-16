import { useId, useState } from 'react';
import './FolderCard.css';
import type { Document } from '../../data/types';
import { FiFile, FiImage, FiEdit3, FiBookOpen, FiMonitor, FiAward, FiClipboard, FiFileText, FiSearch, FiUser } from 'react-icons/fi';

export interface FolderCardProps {
  label: string;
  files: Document[];
  onOpen?: () => void;
}

const typeIcons: Record<Document['type'], React.ElementType> = {
  notes: FiBookOpen,
  pdf: FiFile,
  image: FiImage,
  assignment: FiEdit3,
  ppt: FiMonitor,
  certificate: FiAward,
  report: FiClipboard,
  'lab-journal': FiFileText,
  research: FiSearch,
  resume: FiUser,
};

export default function FolderCard({ label: _label, files, onOpen }: FolderCardProps) {
  const checkboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsOpen(checked);
    if (checked && onOpen) {
      setTimeout(() => {
        onOpen();
        setIsOpen(false);
      }, 800);
    }
  };
  
  // Pick up to 5 files to show inside
  const displayFiles = files.slice(0, 5);
  // Ensure we have 5 elements for the CSS classes to work perfectly, pad if needed
  // Actually, we can just render the ones we have, but assign classes file-1 to file-N (from top to bottom).
  // The top file is file-1 (z-index 25), file-5 is back (z-index 21).
  // So if we have 3 files, they should be file-1, file-2, file-3.

  return (
    <div className="folder-card-wrapper">
      <label className="folder-card" htmlFor={checkboxId}>
        <input 
          type="checkbox" 
          id={checkboxId} 
          className="folder-toggle" 
          checked={isOpen}
          onChange={handleToggle}
        />
        <div className="folder-container">
          <svg className="folder-back" viewBox="0 0 50 40" fill="none">
            <path d="M0 4C0 1.79086 1.79086 0 4 0H16.524C17.721 0 18.8415 0.54051 19.574 1.4673L22.426 5.0654C23.1585 5.99219 24.279 6.5327 25.476 6.5327H46C48.2091 6.5327 50 8.32356 50 10.5327V36C50 38.2091 48.2091 40 46 40H4C1.79086 40 0 38.2091 0 36V4Z" fill="#0056b3" />
          </svg>
          
          {/* Render files in reverse so file-5 is in the back (DOM order vs Z-index). 
              The original has file-5 first in DOM. */}
          {[...displayFiles].reverse().map((file, index) => {
            // Re-calculate the class index: if we have 3 files, they are file-1, file-2, file-3.
            // Reversed: file-3, file-2, file-1
            const classIdx = displayFiles.length - index;
            const Icon = typeIcons[file.type];
            return (
              <div key={file.id} className={`folder-file file-${classIdx}`}>
                <div className="file-shine" />
                <Icon className="file-icon" size={14} />
                <div className="file-text truncate">{file.title}</div>
                <div className="file-tag uppercase">{file.type} • {file.date.substring(0,4)}</div>
              </div>
            );
          })}

          <div className="folder-front-wrapper">
            <svg className="folder-front" viewBox="0 0 50 34" fill="none">
              <path d="M0 4C0 1.79086 1.79086 0 4 0H46C48.2091 0 50 1.79086 50 4V30C50 32.2091 48.2091 34 46 34H4C1.79086 34 0 32.2091 0 30V4Z" fill="rgba(0, 123, 255, 0.65)" />
            </svg>
            <div className="folder-label flex items-center justify-center -mt-0.5">
               {/* Label on the folder */}
            </div>
            <div className="folder-counter">
              <div className="status-dot" />
              <span className="counter-number pl-1">{files.length.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
}
