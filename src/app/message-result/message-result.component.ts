import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-message-result',
  templateUrl: './message-result.component.html',
  styleUrls: ['./message-result.component.css']
})
export class MessageResultComponent {
  message: { type: 'Success' | 'Failed' | 'Uploading', text: string } | null = null;
  
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.message$.subscribe(message => {
      this.message = message;

      // Auto-clear message after a few seconds
      if (message && message.type !== 'Uploading') {
        setTimeout(() => this.dataService.clearMessage(), 4000);
      }
    });
  }

  showMessage(type: 'Success' | 'Failed' | 'Uploading', text: string) {
    this.message = { type, text };
  }

  clearMessage() {
    this.message = null;
  }

  getMessageClass() {
    switch (this.message?.type) {
      case 'Success':
        return 'success';
      case 'Failed':
        return 'failed';
      case 'Uploading':
        return 'uploading';
      default:
        return '';
    }
  }
}
