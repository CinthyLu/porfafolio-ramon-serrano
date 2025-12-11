export type ProjectCategory = 'academic' | 'laboral';
export type ParticipationType = 'Frontend' | 'Backend' | 'Base de Datos' | 'Fullstack' | 'DevOps';

export interface Project {
  id?: string;
  name: string;
  description: string;
  category: ProjectCategory;
  participation: ParticipationType;
  technologies: string[];
  repoUrl?: string;
  deployUrl?: string;
  demoUrl?: string;
  createdAt?: string;
}
