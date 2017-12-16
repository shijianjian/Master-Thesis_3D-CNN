import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PredictionPageComponent } from './prediction/prediction-page.component';
import { TrainingPageComponent } from './training/training-page.component';

export const appRoutes: Routes = [
    { 
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full'
    },
    {
        path: 'home', 
        component: HomeComponent, 
    },
    { 
        path: 'prediction', 
        component: PredictionPageComponent, 
    },
    { 
        path: 'training', 
        component: TrainingPageComponent, 
    },
    { path:'**', redirectTo: '/home'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});