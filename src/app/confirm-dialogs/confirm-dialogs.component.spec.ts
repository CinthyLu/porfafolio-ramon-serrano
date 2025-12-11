import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogsComponent } from './confirm-dialogs.component';

describe('ConfirmDialogsComponent', () => {
  let component: ConfirmDialogsComponent;
  let fixture: ComponentFixture<ConfirmDialogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
