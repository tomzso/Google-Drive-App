import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-folder-dialog',
  templateUrl: './folder-dialog.component.html',
  styleUrls: ['./folder-dialog.component.css']
})

export class FolderDialogComponent {
  folderName: string = '';

  constructor(
    public dialogRef: MatDialogRef<FolderDialogComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    this.dialogRef.close(this.folderName);
  }
}
