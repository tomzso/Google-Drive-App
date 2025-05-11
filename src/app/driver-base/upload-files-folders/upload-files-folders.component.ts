import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GoogleDriveService } from '../../services/googleDrive.service';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FolderDialogComponent } from '../../folder-dialog/folder-dialog.component';

@Component({
  selector: 'app-upload-files-folders',
  templateUrl: './upload-files-folders.component.html',
  styleUrl: './upload-files-folders.component.css'
})
export class UploadFilesFoldersComponent implements OnInit {
  folderName: string = ''; // Variable to store the name of the folder to be created
  currentFolderId: string; // ID of the current folder being viewed
  subscription!: Subscription; // Subscription to data service for folder navigation

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  constructor(
    private googleDriveService: GoogleDriveService,
    private dataService: DataService,
    public dialog: MatDialog
  ) {
    this.currentFolderId = 'root';
  }
  ngOnInit(): void {
    // Subscribe to data service to receive updates on current folder
    this.subscription = this.dataService.data$.subscribe((data) => {
      this.currentFolderId = data;
    });
  }

  openCreateFolderDialog(): void {
    const dialogRef = this.dialog.open(FolderDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(folderName => {
      if (folderName) {
        this.folderName = folderName;
        this.onFolderCreate();
      }
    });
  }

  // Method to create a new folder
  onFolderCreate() {
    if (this.folderName === '') return;
    // Call Google Drive service to create a new folder
    this.googleDriveService.createFolder(this.folderName, this.currentFolderId).subscribe(
      (response) => {
        this.dataService.sendMessage('Uploading', 'Creating Folder...');
        // After folder creation, rename the folder
        this.googleDriveService.renameFile(response.id, this.folderName).subscribe(
          (response) => {
            setTimeout(() => {
              this.updateRoot();
            }, 500);
            this.dataService.sendMessage('Success', 'Folder created successfully.');
          },
          (error) => {
            console.error('Error rename file:', error);
            setTimeout(() => {
              this.updateRoot();
            }, 500);
            this.dataService.sendMessage('Failed', 'Failed to rename file.');
          }
        );
        this.folderName = '';
      },
      (error) => {
        console.error('Error uploading file:', error);
        this.dataService.sendMessage('Failed', 'Failed to create folder.');
      }
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadFileToDrive(file);
    }

    // Reset the input so same file can be reselected
    event.target.value = '';
  }

  // Method to upload a file to Google Drive
  uploadFileToDrive(file: File) {
    this.dataService.sendMessage('Uploading', 'Uploading...');
    const name = file.name.split('.')[0]; // Extract file name without extension
    this.googleDriveService.uploadFile(file).subscribe(
      (response) => {
        // After file upload, rename the file
        this.renameFile(response.id, name);
        // Move the file to the current folder
        this.googleDriveService.moveFileToFolder(response.id, this.currentFolderId).subscribe(
          (response) => {
            setTimeout(() => {
              this.updateRoot();
            }, 500);
            this.dataService.sendMessage('Success', 'File uploaded successfully.');
          },
          (error) => {
            setTimeout(() => {
              this.updateRoot();
            }, 500);
            console.error('Error moving file:', error);
            this.dataService.sendMessage('Failed', 'Failed to move file.');
          }
        );
      },
      (error) => {
        console.error('Error uploading file:', error);
        this.dataService.sendMessage('Failed', 'Failed to upload file.');
      }
    );
  }

  // Method to rename a file
  renameFile(fileId: string, newName: string) {
    this.googleDriveService.renameFile(fileId, newName)
      .subscribe(response => {
        console.log('File renamed successfully:', response);
      }, error => {
        console.error('Error renaming file:', error);
      });
  }

  // Method to update the root folder in the data service
  updateRoot() {
    this.dataService.sendData(this.currentFolderId);
  }
}
