import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./layouts/components/navbar/navbar.component";
import { ToastModule } from 'primeng/toast'
import { NgxSpinnerComponent } from "ngx-spinner";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ToastModule, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
