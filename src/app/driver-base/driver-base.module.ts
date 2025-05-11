import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderListComponent } from './folder-list/folder-list.component';
import { GoogleDriveService } from '../services/googleDrive.service';
import { AuthGuard } from '../services/authGuard.service';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FileListComponent } from './file-list/file-list.component';
import { UploadFilesFoldersComponent } from './upload-files-folders/upload-files-folders.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FolderListComponent, FileListComponent, UploadFilesFoldersComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    FolderListComponent,
    FileListComponent,
    UploadFilesFoldersComponent
  ],
  providers: [
    GoogleDriveService,
    AuthGuard,
    AuthService
  ]
})
export class DriverBaseModule { }
