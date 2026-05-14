import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./layouts/components/navbar/navbar.component";
import { ToastModule } from 'primeng/toast'
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
