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
import { TaskDetailComponent } from '../task-detail/task-detail.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    CreateTaskComponent,
    RouterModule,
    ModalComponent,
    FormsModule,
    TaskDetailComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  editedContent: string = '';
editedDescription: string = '';
editedDueDate: string = ''; // Nowe pole na datę
  editedPriority: number = 1;
  tasks: any[] = [];
  todoistService: TodoistService = inject(TodoistService);
  router: any;

  ngOnInit(): void {
    this.loadTasks();
  }
  selectedTask: TaskModel | undefined;
  openEditModal(task: TaskModel): void {
    this.selectedTask = task;
    this.editedContent = task.content;
    this.editedDescription = task.description || '';
    this.editedDueDate = task.dueDate ? task.dueDate : ''; // Jeśli zadanie ma datę, wczytujemy ją
    this.editedPriority = task.priority || 1; // Jeśli zadanie ma priorytet, wczytujemy go
  }

  saveChanges(): void {
    if (this.selectedTask) {
      // Wywołanie serwisu do aktualizacji zadania
      this.todoistService
        .updateTask(
          this.selectedTask.id,
          this.editedContent,
          this.editedDescription,
          this.editedDueDate,
          this.editedPriority
        )
        .then((response) => {
          console.log('Zaktualizowane zadanie:', response);
          // Odświeżenie listy zadań po aktualizacji
          this.loadTasks();
        })
        .catch((error) => {
          console.error('Błąd podczas aktualizacji zadania:', error);
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
  viewTaskDetails(taskId: string): void {
    this.router.navigate([`/detail/${taskId}`]);  // Przekierowanie na stronę szczegółów
  }
}
