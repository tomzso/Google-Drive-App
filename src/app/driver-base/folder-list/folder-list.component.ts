import { Component, OnInit } from '@angular/core';
import { FolderInfo } from '../../models/FolderInfo';
import { GoogleDriveService } from '../../services/googleDrive.service';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-folder-list',
  templateUrl: './folder-list.component.html',
  styleUrl: './folder-list.component.css'
})
export class FolderListComponent implements OnInit{
  folders: FolderInfo[] = []; // Array to store folder information
  pathId: string[] = []; // Array to store folder IDs in the current path
  pathName: string[] = []; // Array to store folder names in the current path
  currentFolderId: string; // ID of the current folder being viewed
  combinedPath: string; // Combined path string showing the current folder hierarchy
  joinedPath: string = ' > '; // Separator for joining folder names in the path
  subscription!: Subscription; // Subscription to data service for folder navigation

  constructor(
    private googleDriveService: GoogleDriveService,
    private dataService: DataService
  ) { 
    this.pathId.push("Root");
    this.pathName.push("Root");
    this.currentFolderId = 'root';
    this.combinedPath = this.pathName.join(' ' + this.joinedPath + ' ');
    this.updateRoot();
  }

  ngOnInit(): void {
    this.getFolderStructure(this.currentFolderId);
    this.subscription = this.dataService.data$.subscribe((data) => {
      // Update current folder ID whenever data changes
      this.currentFolderId = data;

      // Fetch folder structure for the updated current folder
      this.getFolderStructure(this.currentFolderId);

    });
  }

   // Method to update the current folder in the data service
  updateRoot() {
    this.dataService.sendData(this.currentFolderId);
  }

  // Method to fetch folder structure for a given folder
  getFolderStructure(folderId: string) {
    this.googleDriveService.getFolderStructure(folderId).subscribe(
      (data) => {
        const folderStructure = data.files;
        this.folders = folderStructure.map((folder: any) => {
          return {
            id: folder.id,
            name: folder.name,
            parents: folder.parents[0],
            type: folder.mimeType.split('.').pop(),
            createdTime: folder.createdTime,
            iconLink: folder.iconLink,
            modifiedTime: folder.modifiedTime
          };
        });
        console.log('Folder structure:', this.folders);
      },
      (error) => {
        console.error('Error fetching folder structure:', error);
      }
    );
  }

  // Method to delete a folder
  deleteFolder(id: string) {
    this.googleDriveService.deleteFile(id).subscribe(
      (data) => {
        console.log('File deleted:', data);
        // After deletion, fetch folder structure of the current folder again
        this.getFolderStructure(this.currentFolderId);
        this.dataService.sendMessage('Success', 'Folder deleted successfully.');
      },
      (error) => {
        console.error('Error deleting file:', error);
        this.dataService.sendMessage('Failed', 'Failed to delete folder.');
      }
    );
  }

  // Method to navigate to a folder
  navigateFolder(folderId: string, folderName: string) {
    this.pathId.push(folderId);
    this.pathName.push(folderName);
    this.currentFolderId = folderId;
    // Fetch folder structure for the selected folder
    this.getFolderStructure(folderId);
    // Update combined path string
    this.combinedPath = this.pathName.join('   ' + this.joinedPath + '   ');
    // Update root folder
    this.updateRoot();
  }

  // Method to navigate back to the parent folder
  navigateBack() {
    if (this.pathId.length <= 1) {
      return; // Don't navigate back if already at root
    }
    this.pathId.pop();
    this.pathName.pop();
    this.currentFolderId = this.pathId[this.pathId.length - 1];
    // Fetch folder structure for the parent folder
    this.getFolderStructure(this.currentFolderId);
    // Update combined path string
    this.combinedPath = this.pathName.join('   ' + this.joinedPath + '   ');
    // Update root folder
    this.updateRoot();
  }

}
