import { Routes } from '@angular/router';
  import { loginGuard } from './core/auth/guards/login-guard';
import { authGuard } from './core/auth/guards/auth.guard';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
     path: '',
        canActivate: [authGuard],
        loadComponent: () =>
        import('./layouts/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
        children:  [

            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent),
                canActivate: [authGuard],
                title: 'Dashboard Page',

            },
            {
                path: 'customer/:cif',
                loadComponent: () =>
                    import('./features/customer-details/customer-details.component').then(c => c.CustomerDetailsComponent),
                canActivate: [authGuard],
                title: 'Customer Details Page',

            },
            {
                path: 'transactions/:accountId',
                loadComponent: () =>
                    import('./features/transactions/transactions.component').then(c => c.TransactionsComponent),
                canActivate: [authGuard],
                title: 'Transactions Page',

            },

        ]
    },
    {
        path: '', loadComponent: () =>
            import('./layouts/auth-layout/auth-layout.component').then(c => c.AuthLayoutComponent), children: [

            {
                path: 'login',
                canActivate: [loginGuard],
                loadComponent: () =>
                    import('./features/login/login.component').then(c => c.LoginComponent),
                title: 'Login Page'

            },
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];
