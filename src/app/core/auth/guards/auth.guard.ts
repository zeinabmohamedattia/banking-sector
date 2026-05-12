import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {

    const router = inject(Router);

    const admin = localStorage.getItem('admin');

    if (admin) {
        return true;
    }

    return router.parseUrl('/login');
};