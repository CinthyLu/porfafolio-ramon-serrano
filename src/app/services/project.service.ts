import { Injectable } from '@angular/core';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private col = collection(db, 'projects');

  constructor() {}

  async createProject(p: Project & { programmerId: string }) {
    const payload = { ...p, createdAt: new Date().toISOString() };
    const docRef = await addDoc(this.col, payload as any);
    return { ...(payload as any), id: docRef.id } as Project;
  }

  async listByProgrammer(programmerId: string) {
    const q = query(this.col, where('programmerId', '==', programmerId));
    const snaps = await getDocs(q);
    const items: Project[] = [];
    snaps.forEach(s => items.push({ ...(s.data() as Project), id: s.id }));
    return items;
  }

  async updateProject(id: string, data: Partial<Project>) {
    const docRef = doc(db, 'projects', id);
    await updateDoc(docRef, data as any);
  }

  async deleteProject(id: string) {
    const docRef = doc(db, 'projects', id);
    await deleteDoc(docRef);
  }
}
