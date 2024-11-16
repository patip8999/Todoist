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
import { DragAndDropDirective } from '../drag-and-drop.directive';
import { TruncateNamePipe } from '../truncate-name.pipe';
import { TaskDoneDirective } from '../task-done.directive';

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
    TaskDetailComponent,
    DragAndDropDirective,
    TruncateNamePipe, TaskDoneDirective
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  editedContent: string = '';
editedDescription: string = '';
editedDueDate: string = ''; // Nowe pole na datę
  editedPriority: number = 1;
  tasks = signal<TaskModel[]>([]);;
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
      this.tasks.set(tasks); // Ustawiamy zadania w sygnale
    });
  }
  toggleDescription(task: any): void {
    if (task.isDescriptionVisible) {
      task.isDescriptionVisible.update((current: boolean) => !current);
    }
  }
  deleteTask(taskId: string): void {
    this.todoistService.deleteTask(taskId).subscribe(() => {
      this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
      console.log('Zadanie zostało pomyślnie usunięte.');
    });
  }
  viewTaskDetails(taskId: string): void {
    this.router.navigate([`/detail/${taskId}`]);  
  }
  onTaskReordered(event: { from: string; to: string }): void {
    const { from, to } = event;
  
    console.log('Zadanie przeniesione z', from, 'na', to);
  
    // Przykład logiki, by zamienić miejscami zadania w tablicy
    const tasks = this.tasks();
    const draggedTask = tasks.find((task) => task.id === from);
    const targetTask = tasks.find((task) => task.id === to);
  
    if (draggedTask && targetTask) {
      const draggedIndex = tasks.indexOf(draggedTask);
      const targetIndex = tasks.indexOf(targetTask);
  
      // Zamiana miejscami
      tasks[draggedIndex] = targetTask;
      tasks[targetIndex] = draggedTask;
  
      // Zaktualizowanie sygnalnych zadań
      this.tasks.set([...tasks]);
    }
  }
  status: 'Pending' | 'Done' = 'Pending';
  changeStatus(taskData: { taskId: number, status: 'Pending' | 'Done' }): void {
    const tasks = this.tasks();  // Pobierz tablicę zadań
  
    const task = tasks.find(t => t.id === taskData.taskId.toString());   // Używamy "+" do konwersji
  
    if (task) {
      // Sprawdzenie, czy status jest jednym z dopuszczalnych
      if (taskData.status === 'Pending' || taskData.status === 'Done') {
        task.status = taskData.status;
        this.tasks.set(tasks);  // Zaktualizowanie sygnału
        this.saveTasksToLocalStorage();  // Zapisanie do localStorage
      }
    }
  }
  private saveTasksToLocalStorage(): void {
    const tasks = this.tasks();  // Pobieranie wartości z sygnału
    localStorage.setItem('tasks', JSON.stringify(tasks));  // Zapisanie do localStorage
  }
}