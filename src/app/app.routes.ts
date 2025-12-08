import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/forms/login/login';
import { Component } from '@angular/core';
import { Users } from './features/management/users/users';


export const routes: Routes = [
    {path: '', component: Home},
    {path: 'login', component: Login},
    {path: 'main', component: Users}
];
