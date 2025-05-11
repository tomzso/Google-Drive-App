import { Component, OnInit } from '@angular/core';
import { AuthGuard } from './services/authGuard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  activateRouterOutlet: boolean = false;

  constructor(private authGuard: AuthGuard) {
    // Check if the user is authenticated (logined in)
    this.activateRouterOutlet = !authGuard.canActivate();
  }

}
