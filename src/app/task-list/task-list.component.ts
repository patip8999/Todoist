import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { TodoistService } from '../Services/todoist.service';


import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [HttpClientModule, 
 
     CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  todoistService: TodoistService = inject(TodoistService)

  

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.todoistService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  addTask(content: string): void {
    this.todoistService.addTask(content).subscribe(task => {
      this.tasks.push(task); 
    });
  }
}

