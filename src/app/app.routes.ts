import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/forms/login/login';
import { Register } from './features/forms/register/register';
import { Users } from './features/management/users/users';
import { Portfolio } from './features/management/portfolio/portfolio';
import { Projects } from './features/management/projects/projects';
import { MyProjects } from './features/management/projects/my-projects';
import { Consulting } from './features/consulting/consulting';
import { Schedule } from './features/consulting/schedule';
import { Upmedia } from './upmedia/upmedia';
import { Appointments } from './features/management/appointments/appointments';
import { AdminDashboard } from './features/management/admin-dashboard/admin-dashboard';
import { Advisories } from './features/management/advisories/advisories';
import { Role } from './models/role.enum';
import { RoleGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';
import { Profile } from './features/profile/profile';
import { MyAppointments } from './features/management/users/my-appointments/my-appointments';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },

  // PUBLIC
  { path: 'projects', component: Projects },
  { path: 'consulting', component: Consulting },

  // LOGIN / REGISTER
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // REQUIERE LOGIN NORMAL
  {
    path: 'consulting/schedule',
    component: Schedule,
    canActivate: [AuthGuard]
  },

  // ADMIN
  {
    path: 'admin/dashboard',
    component: AdminDashboard,
    canActivate: [RoleGuard],
    data: { roles: Role.Admin }
  },
  {
    path: 'admin/advisories',
    component: Advisories,
    canActivate: [RoleGuard],
    data: { roles: Role.Admin }
  },
  {
    path: 'users',
    component: Users,
    canActivate: [RoleGuard],
    data: { roles: Role.Admin }
  },
  {
    path: 'portfolio',
    component: Portfolio,
    canActivate: [RoleGuard],
    data: { roles: Role.Admin }
  },
  {
    path: 'admin/portfolio',
    component: Portfolio,
    canActivate: [RoleGuard],
    data: { roles: Role.Admin }
  },
  { path: 'portfolio/:id', component: Upmedia },

  // PROGRAMADOR
  {
    path: 'my-projects',
    component: MyProjects,
    canActivate: [RoleGuard],
    data: { roles: Role.Programmer }
  },
  {
    path: 'appointments',
    component: Appointments,
    canActivate: [RoleGuard],
    data: { roles: Role.Programmer }
  },

  // USER (usuario normal)
  {
    path: 'my-appointments',
    component: MyAppointments,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: Role.User }
  },

  { path: '**', redirectTo: '' },
];
