import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true
})
export class Home {
  constructor(private seoService: SeoService) {
    this.seoService.setSeoData(
      'Inicio - Portafolio Ramón Serrano',
      'Bienvenido al portafolio de Ramón Serrano. Explora mis proyectos y servicios.',
      'Inicio, Ramón Serrano, Portafolio, Proyectos, Servicios'
    );
  }
}
