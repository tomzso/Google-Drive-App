import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFilesFoldersComponent } from './upload-files-folders.component';

describe('UploadFilesFoldersComponent', () => {
  let component: UploadFilesFoldersComponent;
  let fixture: ComponentFixture<UploadFilesFoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadFilesFoldersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadFilesFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
