import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MediaDataBaseComponent } from './mediaDataBase/mediaDataBase.component';
import { PageNotFoundComponent } from './pageNotFound/pageNotFound.component';
const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'mediadatabase', component: MediaDataBaseComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];
@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
