import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { TodoistService } from '../Services/todoist.service';
import { CommonModule } from '@angular/common';
import { Task, TodoistApi } from '@doist/todoist-api-typescript';
import { environment } from '../../environments/enviroments.prod';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, CreateTaskComponent, RouterModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = []; 
  todoistService: TodoistService = inject(TodoistService);

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.todoistService.getTasks().subscribe(tasks => {
   
      this.tasks = tasks.map((task: any) => ({
        ...task,
        isDescriptionVisible: signal<boolean>(false) 
      }));
    });
  }

  toggleDescription(task: any): void {
  
    task.isDescriptionVisible.update((current: boolean) => !current); 
  }

  deleteTask(taskId: string): void {
    this.todoistService.deleteTask(taskId).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      console.log("Zadanie zostało pomyślnie usunięte.");
    });
  }
}