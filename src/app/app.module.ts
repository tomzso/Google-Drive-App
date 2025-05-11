import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DriverBaseModule } from './driver-base/driver-base.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FolderDialogComponent } from './folder-dialog/folder-dialog.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MessageResultComponent } from './message-result/message-result.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [			
    AppComponent,
      LoginComponent,
      DashboardComponent,
      FolderDialogComponent,
      MessageResultComponent
   ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    DriverBaseModule,
    FormsModule,
    FontAwesomeModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
  ],

  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
