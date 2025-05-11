import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageResultComponent } from './message-result.component';

describe('MessageResultComponent', () => {
  let component: MessageResultComponent;
  let fixture: ComponentFixture<MessageResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
