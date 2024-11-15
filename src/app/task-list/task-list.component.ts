import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { TodoistService } from '../Services/todoist.service';
import { CommonModule } from '@angular/common';
import { Task, TodoistApi } from '@doist/todoist-api-typescript';
import { environment } from '../../environments/enviroments.prod';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { TaskModel } from '../Models/task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    CreateTaskComponent,
    RouterModule,
    ModalComponent,
    FormsModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  editedContent: string = '';
editedDescription: string = '';
  tasks: any[] = [];
  todoistService: TodoistService = inject(TodoistService);

  ngOnInit(): void {
    this.loadTasks();
  }
public selectedTask = signal<TaskModel | undefined>(undefined)
openEditModal(task: TaskModel): void {
  this.selectedTask.set(task); // Przypisanie wybranego zadania do sygnału
  const currentTask = this.selectedTask();
  if (currentTask) {
    this.editedContent = currentTask.content; // Wypełnienie polami do edycji
    this.editedDescription = currentTask.description;
  }
}
saveChanges(): void {
  const currentTask = this.selectedTask();
  if (currentTask) {
    currentTask.content = this.editedContent;
    currentTask.description = this.editedDescription;

    this.todoistService.updateTask(currentTask).subscribe(() => {
      this.loadTasks(); // Odśwież listę zadań
      console.log('Zadanie zostało pomyślnie zaktualizowane.');
    });
  }
}
  loadTasks(): void {
    this.todoistService.getTasks().subscribe((tasks) => {
      this.tasks = tasks.map((task: any) => ({
        ...task,
        isDescriptionVisible: signal<boolean>(false),
      }));
    });
  }

  toggleDescription(task: any): void {
    task.isDescriptionVisible.update((current: boolean) => !current);
  }

  deleteTask(taskId: string): void {
    this.todoistService.deleteTask(taskId).subscribe(() => {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
      console.log('Zadanie zostało pomyślnie usunięte.');
    });
  }
}
