import { Component, inject, Input, OnInit } from '@angular/core';
import { TodoistService } from '../Services/todoist.service';
import { Observable } from 'rxjs';
import { TaskModel } from '../Models/task.model';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [AsyncPipe,CommonModule ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
  providers: [DatePipe], 
})
export class TaskDetailComponent implements OnInit {
   task: TaskModel | null = null;  

  private activatedRoute = inject(ActivatedRoute);  
  private todoistService = inject(TodoistService); 
  private datePipe = inject(DatePipe);
  ngOnInit(): void {
    const taskId = this.activatedRoute.snapshot.paramMap.get('taskId');
    
    if (taskId) {
      this.todoistService.getTask(taskId).subscribe(task => {
        console.log('Pobrane zadanie:', task); 
        this.task = task;
      });
    }
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
}