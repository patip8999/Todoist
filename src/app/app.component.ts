import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { DateFormatPipe } from './date-format.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,  CommonModule, NavbarComponent, DateFormatPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  currentDate: Date = new Date();

  ngOnInit(): void {
    this.currentDate = new Date(); // Inicjalizujemy datę
  }





  title = 'TodoistProject';
}
