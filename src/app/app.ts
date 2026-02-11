import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './pages/header/header';
import { Footer } from './pages/footer/footer';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portafolio-ramon-serrano');

  constructor(private seoService: SeoService) {
    this.seoService.setSeoData(
      'Portafolio Ramón Serrano',
      'Portafolio profesional de Ramón Serrano. Desarrollador web, consultor y programador.',
      'Ramón Serrano, Portafolio, Desarrollador Web, Angular, Programador'
    );
  }
}

