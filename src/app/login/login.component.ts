import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import config from '../../assets/config/config.json';

declare global {
  interface Window {
    google: any;
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    const tryRenderButton = () => {
      const btn = document.getElementById('googleBtn');

      if (btn && window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: config.BUTTON_CLIENT_ID,
          callback: (window as any).handleCredentialResponse
        });

        window.google.accounts.id.renderButton(btn, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular'
        });

        window.google.accounts.id.prompt();
    } else {
        setTimeout(tryRenderButton, 100);
    }
  };
  tryRenderButton();
}


}
