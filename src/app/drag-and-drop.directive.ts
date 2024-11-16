import { Directive, ElementRef, HostListener, Output, EventEmitter, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
  standalone: true
})
export class DragAndDropDirective {
  @Output() taskReordered = new EventEmitter<{ from: string; to: string }>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  // Kiedy drag zaczyna się, zmienia kursor na "grab"
  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    const taskId = this.el.nativeElement.getAttribute('data-index');
    event.dataTransfer?.setData('taskId', taskId);
    event.dataTransfer?.setData('index', taskId);

    // Ustawiamy kursor na "grab", co oznacza, że element można chwycić
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
    console.log('Drag started', taskId);
  }

  // Po zakończeniu drag, zmieniamy kursor na "grabbing"
  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    // Ustawiamy kursor na "grabbing", co oznacza, że element jest trzymany
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grabbing');
    console.log('Drag ended');
  }

  // Wydarzenie dragover, aby zezwolić na upuszczanie
  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Wydarzenie drop, które obsługuje upuszczenie elementu
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
