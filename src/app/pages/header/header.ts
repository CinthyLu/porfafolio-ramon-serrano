import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  role: string | null = null;
  fullName: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.user$.subscribe(u => {
      this.role = u?.role || null;
      this.fullName = u?.fullName || null;
    });
  }

  isAdmin() { return this.role === 'admin'; }
  isProgrammer() { return this.role === 'programmer'; }
  isUser() { return this.role === 'user' || this.role === null; }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/']);
  }
}
