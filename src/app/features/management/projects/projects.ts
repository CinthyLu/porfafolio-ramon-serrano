import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-projects',
  imports: [RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  constructor(private seoService: SeoService) {
    this.seoService.setSeoData(
      'Proyectos - Portafolio Ramón Serrano',
      'Explora los proyectos de desarrollo web y software de Ramón Serrano.',
      'Proyectos, Desarrollo Web, Software, Angular, Portfolio'
    );
  }
}
