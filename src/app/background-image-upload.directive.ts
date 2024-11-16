import { Directive, ElementRef, Renderer2, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appBackgroundImageUpload]',
  standalone: true
})
export class BackgroundImageUploadDirective implements OnInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    // Sprawdzamy, czy w localStorage jest zapisany obrazek
    const storedImage = localStorage.getItem('backgroundImage');
    if (storedImage) {
      // Jeżeli jest, ustawiamy go jako tło
      this.setBackgroundImage(storedImage);
    }
  }

  @HostListener('click') onClick() {
    // Tworzymy element input typu file
    const input = this.renderer.createElement('input');
    this.renderer.setAttribute(input, 'type', 'file');
    this.renderer.setAttribute(input, 'accept', 'image/*');

    // Obsługa zmiany pliku
    input.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageUrl = e.target.result;

          // Zmieniamy tło strony głównej (body)
          this.setBackgroundImage(imageUrl);

          // Zapisujemy URL obrazu w localStorage
          localStorage.setItem('backgroundImage', imageUrl);
        };
        reader.readAsDataURL(file);
      }
    });

    // Wywołujemy kliknięcie na input, aby otworzyć okno wyboru pliku
    input.click();
  }

  private setBackgroundImage(imageUrl: string): void {
    // Ustawiamy tło dla strony głównej
    this.renderer.setStyle(document.body, 'background-image', `url(${imageUrl})`);
    this.renderer.setStyle(document.body, 'background-size', 'cover');
    this.renderer.setStyle(document.body, 'background-position', 'center');
  }
}
