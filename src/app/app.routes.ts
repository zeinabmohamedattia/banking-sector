import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CustomerDetailsComponent } from './features/customer-details/customer-details.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/login/login.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { loginGuard } from './core/auth/guards/login-guard';
import { authGuard } from './core/auth/guards/auth.guard';
// import { loginGuard } from './core/auth/guards/login-guard';
// import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: '', component: MainLayoutComponent, children: [
            {
                path: 'dashboard'
                , component: DashboardComponent,
                title: 'Dashboard Page',
                canActivate: [authGuard],
            },
            {
                path: 'customer/:cif', component: CustomerDetailsComponent,
                title: 'Customer Details Page',
                canActivate: [authGuard],
            },
            {
                path: 'transactions/:accountId', component: TransactionsComponent,
                title: 'Transactions Page',
                canActivate: [authGuard],
            },
        ]
    },
    {
        path: '', component: AuthLayoutComponent, children: [
            {
                path: 'login', component: LoginComponent,
                canActivate: [loginGuard],

                 title: 'Login Page'
            },

        ]
    },
    { path: '**', component: NotfoundComponent, title: 'Not Found Page' }
];
