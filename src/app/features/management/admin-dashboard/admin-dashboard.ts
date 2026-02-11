import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface DashboardStats {
  totalProjects: number;
  totalAdvisories: number;
  completedAdvisories: number;
  pendingAdvisories: number;
  advisoryCountByStatus: { [key: string]: number };
  topTechnologies: Array<{ technology: string; count: number }>;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, KeyValuePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDashboard();
  }

  async loadDashboard() {
    try {
      this.loading = true;
      const url = `${environment.apiUrl}/admin/dashboard`;
      const data = await this.http.get<DashboardStats>(url).toPromise();
      this.stats = data || null;
    } catch (e: any) {
      console.error('Error loading dashboard:', e);
      this.error = e?.error?.message || 'Error cargando estadísticas';
    } finally {
      this.loading = false;
    }
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }
}
