export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  grade?: string;
  category: 'theory' | 'lab' | 'elective';
}

export interface Document {
  id: string;
  title: string;
  type: 'notes' | 'pdf' | 'image' | 'assignment' | 'ppt' | 'certificate' | 'report' | 'lab-journal' | 'research' | 'resume';
  semesterId: string;
  subjectName?: string;
  date: string;
  fileUrl?: string;
  thumbnail?: string;
  description?: string;
}

export interface Semester {
  id: string;
  number: number;
  title: string;
  dateRange: string;
  sgpa: number | null;
  subjects: Subject[];
  documents: Document[];
  highlights: string[];
  status?: 'completed' | 'in-progress';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  semesterNumber: number;
  status: 'completed' | 'in-progress' | 'archived';
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  date: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  category: 'course' | 'hackathon' | 'workshop' | 'certification';
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  type: 'internship' | 'hackathon' | 'certification' | 'award' | 'publication';
  location?: string;
  tags?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  semester: number;
  date: string;
  location: string;
  imageUrl: string;
  category: 'event' | 'campus' | 'hackathon' | 'project' | 'team';
}

export interface DashboardStat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}
