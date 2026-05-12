import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = () => {

    const router = inject(Router);

    const admin = localStorage.getItem('admin');

    if (admin) {
        return router.parseUrl('/dashboard');
    }

    return true;
};