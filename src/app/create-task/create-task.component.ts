import { Component, inject } from '@angular/core';
import { TodoistService } from '../Services/todoist.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { FormsModule } from '@angular/forms';
export interface TaskForm {
  readonly name: string;
  readonly description: string;
  readonly dueDate: string;
  readonly priority: number | null;

}
@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, CardComponent, FormsModule],
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
    dueDate: '',
    priority:  null,
  };
  addTask(name: string, description: string, dueDate: string, priority: string): void {
    const taskData = {
      content: name,
      description: description,
      due_date: dueDate,
      priority: parseInt(priority, 10),
    };
  
    this.todoistService.addTask(taskData).subscribe((task) => {
      this.tasks.push(task);
      this.router.navigate(['/']); 
    });
  }
}
