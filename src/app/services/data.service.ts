import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Folder or general data
  private dataSubject = new Subject<any>();
  data$ = this.dataSubject.asObservable();

  // Message system for success/error notifications
  private messageSubject = new BehaviorSubject<{ type: 'Success' | 'Failed' | 'Uploading', text: string } | null>(null);
  message$ = this.messageSubject.asObservable();

  // Send shared data (folder ID)
  sendData(data: any) {
    this.dataSubject.next(data);
  }

  // Send a message to display
  sendMessage(type: 'Success' | 'Failed' | 'Uploading', text: string) {
    this.messageSubject.next({ type, text });
  }

  // Clear the message from display
  clearMessage() {
    this.messageSubject.next(null);
  }
}
