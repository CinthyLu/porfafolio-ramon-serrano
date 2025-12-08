import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  
  // Subject para comunicación general entre componentes
  private messageSubject = new BehaviorSubject<any>(null);
  public message$ = this.messageSubject.asObservable();

  // Subject para datos de usuario
  private userDataSubject = new BehaviorSubject<any>(null);
  public userData$ = this.userDataSubject.asObservable();

  // Subject para estado de navegación
  private navigationSubject = new BehaviorSubject<string>('');
  public navigation$ = this.navigationSubject.asObservable();

  constructor() { }

  // Métodos para enviar mensajes
  sendMessage(message: any) {
    this.messageSubject.next(message);
  }

  // Métodos para enviar datos de usuario
  setUserData(data: any) {
    this.userDataSubject.next(data);
  }

  getUserData(): Observable<any> {
    return this.userData$;
  }

  // Métodos para notificar cambios de navegación
  setNavigation(route: string) {
    this.navigationSubject.next(route);
  }

  getNavigation(): Observable<string> {
    return this.navigation$;
  }

  // Método para limpiar datos
  clearData() {
    this.messageSubject.next(null);
    this.userDataSubject.next(null);
  }
}
