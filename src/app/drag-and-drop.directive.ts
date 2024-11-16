import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
  standalone: true
})
export class DragAndDropDirective {
  // Określamy typ danych jako { from: string; to: string }
  @Output() taskReordered = new EventEmitter<{ from: string; to: string }>();

  constructor(private el: ElementRef) {}

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    const taskId = this.el.nativeElement.getAttribute('data-index');
    event.dataTransfer?.setData('taskId', taskId);
    event.dataTransfer?.setData('index', taskId);
    console.log('Drag started', taskId);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
  
    const draggedTaskId = event.dataTransfer?.getData('taskId');
    const targetTaskId = this.el.nativeElement.getAttribute('data-index');
  
    // Sprawdzamy, czy obydwa taskId są dostępne (nie są undefined)
    if (draggedTaskId && targetTaskId) {
      this.taskReordered.emit({
        from: draggedTaskId, // ID zadania przenoszonego
        to: targetTaskId,     // ID zadania docelowego
      });
  
      console.log('Drop finished', draggedTaskId, targetTaskId);
    } else {
      console.error('Nieprawidłowe dane podczas upuszczania zadania');
    }
  }
}