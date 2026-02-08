import { Injectable } from '@angular/core';
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../main';
import { User } from '../models/user.model';
import { Role } from '../models/role.enum';


@Injectable({ providedIn: 'root' })
export class UserService {
  private usersCollection = collection(db, 'users');

  constructor() {}

  async createProgrammer(user: User) {
    // Use email as document id to be consistent with register.ts
    const id = user.email;
    const docRef = doc(db, 'users', id);
    await setDoc(docRef, { ...user, role: Role.Programmer, createdAt: new Date().toISOString() });
    return id;
  }

  async updateUser(id: string, data: Partial<User>) {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, data as any);
  }

  async deleteUser(id: string) {
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
  }

  async getUserById(id: string): Promise<User | null> {
    const docRef = doc(db, 'users', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as User;
      data.id = snap.id;
      return data;
    }
    return null;
  }
async updateUserByEmail(email: string, data: Partial<any>) {
  const ref = doc(db, 'users', email);
  await updateDoc(ref, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

  async listProgrammers(): Promise<User[]> {
    const q = query(this.usersCollection, where('role', '==', Role.Programmer));
    const snaps = await getDocs(q);
    const items: User[] = [];
    snaps.forEach(s => items.push({ ...(s.data() as User), id: s.id }));
    return items;
  }

  //lista tdods los usuarios
  async listUsers(): Promise<User[]> {
    const ref = collection(db, 'users');
    const snap = await getDocs(ref);

    return snap.docs.map(d => {
      const data = d.data() as User;
      return { ...data, id: d.id };
    });
  }
// Actualiza  el rol
  async updateUserRole(emailDocId: string, role: Role): Promise<void> {
    const ref = doc(db, 'users', emailDocId);
    await updateDoc(ref, {
      role,
      updatedAt: new Date().toISOString(),
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const ref = doc(db, 'users', email);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as User;
    data.id = snap.id;
    return data;
  }
  async updateMyProfile(email: string, data: any): Promise<void> {
    const ref = doc(db, 'users', email);
        const { role, ...safe } = data;

    await updateDoc(ref, {
      ...safe,
      updatedAt: new Date().toISOString(),
    });
}
}
