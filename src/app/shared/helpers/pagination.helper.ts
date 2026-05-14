import { signal, computed, Signal } from '@angular/core';

export class PaginationHelper<T> {
    currentPage = signal(1);
    pageSize = signal(5);

    constructor(private sourceData: Signal<T[]>) { }

    paginatedData = computed(() => {
        const startIndex = (this.currentPage() - 1) * this.pageSize();
        const endIndex = startIndex + this.pageSize();
        return this.sourceData().slice(startIndex, endIndex);
    });

   
    totalPages = computed(() => {
        return Math.ceil(this.sourceData().length / this.pageSize()) || 1;
    });

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages()) {
            this.currentPage.set(page);
        }
    }

    reset() {
        this.currentPage.set(1);
    }
}