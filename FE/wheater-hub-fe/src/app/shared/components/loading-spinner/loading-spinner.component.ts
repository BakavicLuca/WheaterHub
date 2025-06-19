import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container" [ngClass]="containerClass">
      <div 
        class="spinner" 
        [ngClass]="spinnerClass"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.border-width.px]="borderWidth">
      </div>
      <div class="spinner-text" *ngIf="text" [ngClass]="textClass">
        {{ text }}
      </div>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .spinner.primary {
      border-top-color: #007bff;
    }

    .spinner.secondary {
      border-top-color: #6c757d;
    }

    .spinner.success {
      border-top-color: #28a745;
    }

    .spinner.danger {
      border-top-color: #dc3545;
    }

    .spinner.warning {
      border-top-color: #ffc107;
    }

    .spinner.info {
      border-top-color: #17a2b8;
    }

    .spinner.light {
      border-color: #e9ecef;
      border-top-color: #fff;
    }

    .spinner.dark {
      border-color: #495057;
      border-top-color: #212529;
    }

    .spinner-text {
      font-size: 14px;
      color: #666;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .spinner-text.primary {
      color: #007bff;
    }

    .spinner-text.secondary {
      color: #6c757d;
    }

    .spinner-text.success {
      color: #28a745;
    }

    .spinner-text.danger {
      color: #dc3545;
    }

    .spinner-text.warning {
      color: #ffc107;
    }

    .spinner-text.info {
      color: #17a2b8;
    }

    .spinner-text.light {
      color: #f8f9fa;
    }

    .spinner-text.dark {
      color: #212529;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Overlay styles */
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9999;
    }

    .centered {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size: number = 40;
  @Input() borderWidth: number = 3;
  @Input() color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'primary';
  @Input() text: string = '';
  @Input() overlay: boolean = false;
  @Input() containerClass: string = '';
  @Input() spinnerClass: string = '';
  @Input() textClass: string = '';

  constructor() {
    // Set default classes based on color and overlay
  }

  ngOnInit() {
    // Apply color class to spinner
    this.spinnerClass = `${this.spinnerClass} ${this.color}`.trim();
    
    // Apply color class to text if text is provided
    if (this.text) {
      this.textClass = `${this.textClass} ${this.color}`.trim();
    }
    
    // Apply overlay classes if overlay is enabled
    if (this.overlay) {
      this.containerClass = `${this.containerClass} overlay centered`.trim();
    }
  }
}