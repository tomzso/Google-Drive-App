import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { TokenResponse } from '../models/Token';
import { Observable, map, switchMap } from 'rxjs';
import config from '../../assets/config/config.json';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  accessToken: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  
  ) { 
    // Fetch access token on service initialization
    this.authService.getAccessToken().subscribe(
      (response: any ) => {
        console.log('Token fetched successfully:', response);
        const accessToken: string = (response as TokenResponse).access_token;
        this.accessToken = accessToken;
        console.log('AccessToken created', this.accessToken);
      },
      (error) => {
        console.error('Error fetching token:', error);
      }
    );
  }

  // Method to rename a file using Google Apps Script
  renameFile(fileId: string, newName: string) {
    const url = `${config.RENAME_SCRIPT_URL}?fileId=${fileId}&newName=${newName}`;
    return this.http.get(url);
  }

  // Method to get folders inside a specified folder (default is root)
  getFolderStructure(folderId: string = 'root'): Observable<any> {
    return this.authService.getAccessToken().pipe(
      switchMap((response: any) => {
        console.log('Token fetched successfully:', response);
        const accessToken: string = (response as TokenResponse).access_token;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);

        const params = new HttpParams()
          .set('q', `'${folderId}' in parents`)  
          .set('pageSize', '1000')      
          .set('fields', 'files(id,name,mimeType,parents,createdTime,modifiedTime,iconLink)');

        return this.http.get<any>(`${config.BASE_URL_API}`, { headers, params }).pipe(
          map((data: any) => {
            const foldersOnly = data.files.filter((file: any) => file.mimeType === config.FOLDER_MIME_TYPE);
            return { files: foldersOnly };
          })
        );
      })
    );
  }

  // Method to get **files** inside a specified folder (default is root)
  getFileStructure(folderId: string = 'root'): Observable<any> {
    return this.authService.getAccessToken().pipe(
      switchMap((response: any) => {
        console.log('Token fetched successfully:', response);
        const accessToken: string = (response as TokenResponse).access_token;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
        
        const params = new HttpParams()
          .set('q', `'${folderId}' in parents`)  
          .set('pageSize', '1000')              
          .set('fields', 'files(id,name,mimeType,parents,createdTime,size,iconLink,modifiedTime)'); 

        return this.http.get<any>(`${config.BASE_URL_API}`, { headers, params }).pipe(
          map((data: any) => {
            const filesOnly = data.files.filter((file: any) => file.mimeType !== config.FOLDER_MIME_TYPE);
            return { files: filesOnly };
          })
        );
      })
    );
  }

  // Method to upload a file to Google Drive
  uploadFile(file: File) {
    const formData = new FormData();
    let type = file.type;
    switch (file.type) {
      case "text/plain":
          type = "text/html";
          break;
      default:
          break;
    }

    const fileData = new File([file], file.name, { type: type, lastModified: file.lastModified }); 
    formData.append('file', fileData);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
    });
    return this.http.post<any>(config.BASE_URL_UPLOAD_API, formData, { headers });
  }

  // Method to delete a file from Google Drive
  deleteFile(fileId: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
    console.log('delete accesstoken:', this.accessToken);
    return this.http.delete<any>(`${config.BASE_URL_API}/${fileId}`, { headers });
  }

  // Method to create a new folder in Google Drive
  createFolder(folderName: string, parentFolderId: string = 'root'): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    const body = {
      name: folderName,
      mimeType: config.FOLDER_MIME_TYPE,
      parents: [parentFolderId]
    };
    return this.http.post<any>(config.BASE_URL_API, body, { headers });
  }

  // Method to move a file to a specified folder
  moveFileToFolder(fileId: string, folderId = 'root') {
    const url = `${config.MOVE_FILE_TO_FOLDER_SCRIP_URL}?sourceFileId=${fileId}&targetFolderId=${folderId}`;
    return this.http.get(url);
  }
  // Method to download a file from Google Drive
  downloadFile(fileId: string): Observable<Blob> {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.get(url, { headers, responseType: 'blob' });
  }

}
