import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = new Date().getFullYear();
  
  navigationLinks = [
    { label: 'Home', path: '/' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Projects', path: '/projects' },
    { label: 'Consulting', path: '/consulting' }
  ];

  socialLinks = [
    { icon: '🌐', label: 'Website', url: '#' },
    { icon: '💼', label: 'LinkedIn', url: '#' },
    { icon: '🐱', label: 'GitHub', url: '#' },
    { icon: '✉️', label: 'Email', url: '#' }
  ];
}
