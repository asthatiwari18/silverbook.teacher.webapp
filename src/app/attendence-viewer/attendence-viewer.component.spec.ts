import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendenceViewerComponent } from './attendence-viewer.component';

describe('AttendenceViewerComponent', () => {
  let component: AttendenceViewerComponent;
  let fixture: ComponentFixture<AttendenceViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendenceViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendenceViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
