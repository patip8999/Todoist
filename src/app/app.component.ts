import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { DateFormatPipe } from './date-format.pipe';
 
import { TaskListComponent } from "./task-list/task-list.component";
import { BackgroundImageUploadDirective } from './background-image-upload.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, DateFormatPipe,TaskListComponent, BackgroundImageUploadDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  currentDate: Date = new Date();

  ngOnInit(): void {
    this.currentDate = new Date(); // Inicjalizujemy datę
  }

  dynamicBgColor = 'linear-gradient(135deg, #e0f7fa, #254636)';

  changeBackground() {
    this.dynamicBgColor = 'linear-gradient(135deg, #fbc02d, #ff5722)';
  }



  title = 'TodoistProject';
}
