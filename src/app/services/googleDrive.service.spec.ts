/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GoogleDriveService } from './googleDrive.service';

describe('Service: GoogleDrive', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleDriveService]
    });
  });

  it('should ...', inject([GoogleDriveService], (service: GoogleDriveService) => {
    expect(service).toBeTruthy();
  }));
});
