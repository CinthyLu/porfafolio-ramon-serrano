import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/forms/login/login';
import { Register } from './features/forms/register/register';
import { Users } from './features/management/users/users';
import { Portfolio } from './features/management/portfolio/portfolio';
import { Projects } from './features/management/projects/projects';
import { Consulting } from './features/consulting/consulting';
import { Upmedia } from './upmedia/upmedia';

export const routes: Routes = [
    { path: '', component: Upmedia},
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'users', component: Users },
    { path: 'portfolio', component: Portfolio },
    { path: 'projects', component: Projects },
    { path: 'consulting', component: Consulting },
    { path: '**', redirectTo: '' },
    // { path: 'prueba', component: Upmedia }
];
