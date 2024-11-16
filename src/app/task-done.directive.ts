import { Directive, ElementRef, Renderer2, Input, Output, EventEmitter, HostListener, inject } from '@angular/core';

import { TodoistService } from './Services/todoist.service';

@Directive({
  selector: '[appTaskDone]',
  standalone: true
})
export class TaskDoneDirective {

  @Input() appTaskDone: string = ''; // Status zadania
  @Input() taskId: number = 0; // Id zadania
  @Output() taskStatusChanged = new EventEmitter<{taskId: number, status: string}>(); // Zdarzenie, które wyśle zaktualizowany status zadania

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private taskService: TodoistService = inject(TodoistService) // Wstrzykujemy serwis
  ) {}

  @HostListener('click') onClick() {
    this.toggleTaskStatus();
  }

  // Funkcja zmieniająca status zadania i emitująca zmianę
  private toggleTaskStatus(): void {
    const newStatus = this.appTaskDone === 'Done' ? 'Pending' : 'Done';
    this.appTaskDone = newStatus;

    // Zaktualizowanie statusu na serwerze
    if (this.appTaskDone === 'Done') {
      this.taskService.markTaskAsDone(this.taskId).subscribe(
        () => {
          this.updateTaskBackground();
          this.emitTaskStatusChange();
        },
        (error) => {
          console.error('Błąd przy oznaczaniu zadania:', error);
        }
      );
    } else {
      this.taskService.markTaskAsPending(this.taskId).subscribe(
        () => {
          this.updateTaskBackground();
          this.emitTaskStatusChange();
        },
        (error) => {
          console.error('Błąd przy oznaczaniu zadania jako oczekujące:', error);
        }
      );
    }
  }

  // Aktualizacja tła zadania na podstawie statusu
  private updateTaskBackground(): void {
    const status = this.appTaskDone;

    if (status === 'Done') {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#4CAF50'); // Zielone tło dla "Done"
      this.renderer.setStyle(this.el.nativeElement.querySelector('span'), 'text-decoration', 'line-through'); // Przekreślenie tekstu
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#F1F1F1'); // Szare tło dla "Pending"
      this.renderer.setStyle(this.el.nativeElement.querySelector('span'), 'text-decoration', 'none'); // Usunięcie przekreślenia
    }
  }

  // Emitowanie zdarzenia zmiany statusu zadania
  private emitTaskStatusChange(): void {
    this.taskStatusChanged.emit({ taskId: this.taskId, status: this.appTaskDone });
  }
}
