import { Component, inject } from '@angular/core';
import { TodoistService } from '../Services/todoist.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
export interface TaskForm {
  readonly name: string;
  readonly description: string;
}
@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css',
})
export class CreateTaskComponent {
  todoistService: TodoistService = inject(TodoistService);
  tasks: any[] = [];
  router: Router = inject(Router);
  model: TaskForm = {
    name: '',
    description: '',
  };
  addTask(name: string, description: string): void {
    this.todoistService.addTask(name, description).subscribe((task) => {
      this.tasks.push(task);

      this.router.navigate(['/']);
    });
  }
}
