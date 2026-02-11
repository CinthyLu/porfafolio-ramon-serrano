import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AppointmentService } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-programmer-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './programmer-dashboard.html',
    styleUrl: './programmer-dashboard.scss',
})
export class ProgrammerDashboard implements OnInit {
    loading = true;
    error: string | null = null;
    stats: any = null;

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private apptService: AppointmentService
    ) { }

    async ngOnInit() {
        await this.loadDashboard();
    }

    async loadDashboard() {
        try {
            this.loading = true;
            this.error = null;
            this.stats = await firstValueFrom(
                this.http.get<any>(`${environment.apiUrl}/programmer/dashboard`)
            );
        } catch (e: any) {
            console.error('[programmer-dashboard] Error:', e);
            this.error = e?.error?.message || 'Error cargando dashboard';
        } finally {
            this.loading = false;
        }
    }

    getPercentage(part: number, total: number): string {
        if (!total || total === 0) return '0';
        return ((part / total) * 100).toFixed(1);
    }

    async downloadReport(type: 'advisories' | 'projects', format: 'pdf' | 'excel') {
        try {
            let blob: Blob;
            let filename: string;

            if (type === 'advisories') {
                blob = await this.apptService.downloadProgrammerAdvisoriesReport(format);
                filename = format === 'pdf' ? 'mis-asesorias.pdf' : 'mis-asesorias.xlsx';
            } else {
                blob = await this.apptService.downloadProgrammerProjectsReport(format);
                filename = format === 'pdf' ? 'mis-proyectos.pdf' : 'mis-proyectos.xlsx';
            }

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        } catch (e) {
            console.error('Error downloading report:', e);
            alert('Error descargando reporte');
        }
    }
}
