import { Component, OnInit } from '@angular/core';
import { GoogleDriveService } from '../../services/googleDrive.service';
import { FileInfo } from '../../models/FileInfo';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import config from '../../../assets/config/config.json';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css', '../folder-list/folder-list.component.css']
})
export class FileListComponent implements OnInit{
  files: FileInfo[] = []; // Array to store file information
  currentFolderId: string;
  subscription!: Subscription;  // Subscription to data service for folder navigation
  
  constructor(
    private googleDriveService: GoogleDriveService,
    private dataService: DataService
  ) {
    this.currentFolderId = 'root'; // Initialize current folder ID to root
    this.getFileStructure(this.currentFolderId ); // Fetch file structure for the root folder
   }

  ngOnInit(): void {
    // Subscribe to data service to receive updates on current folder
    this.subscription = this.dataService.data$.subscribe((data) => {
      this.currentFolderId = data;
      this.getFileStructure(this.currentFolderId );
    });
  }

  // Get all files in the current folder
  getFileStructure(folderId: string) {
    this.googleDriveService.getFileStructure(folderId).subscribe(
      (data) => {
        const fileStructure = data.files;
        this.files = fileStructure.map((file: any) => {
          return {
            id: file.id,
            name: file.name,
            parents: file.parents[0],
            type: file.mimeType.split('.').pop(),
            createdTime: file.createdTime,
            size: file.size,
            iconLink: file.iconLink,
            modifiedTime: file.modifiedTime
          };
        });
        console.log('File structure:', this.files);
      },
      (error) => {
        console.error('Error fetching folder structure:', error);
      }
    );
  }

  // Method to delete a file
  deleteFile(id: string) {
    this.googleDriveService.deleteFile(id).subscribe(
      (data) => {
        console.log('File deleted:', data);
        this.getFileStructure(this.currentFolderId);
        this.dataService.sendMessage('Success', 'File deleted successfully.');
      },
      (error) => {
        console.error('Error deleting file:', error);
        this.dataService.sendMessage('Failed', 'Failed to delete file.');
      }
    );
  }

  // Method to format file size in MB
  getFormattedSizeInMB(size: string): string {
    let num: number = parseInt(size);
    const sizeInMB = num / 1048576; // Divide by 1,048,576 to convert to MB
    if (!isNaN(sizeInMB)) {
      return sizeInMB.toFixed(2) + ' MB'; 
    } else {
      return '0.00 MB';
    }
  }

  // Method to download a file
  downloadFile(fileId: string, fileName: string) {
  
    this.googleDriveService.downloadFile(fileId).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Download error', error);
      }
    );
  }
}
