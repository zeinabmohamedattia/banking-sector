import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-table',
  imports: [],
  templateUrl: './skeleton-table.component.html',
  styleUrl: './skeleton-table.component.css',
})
export class SkeletonTableComponent {
  @Input() rows: number = 5;
  @Input() cols: number = 4;
}
