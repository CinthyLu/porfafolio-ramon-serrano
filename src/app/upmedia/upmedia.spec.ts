import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Upmedia } from './upmedia';

describe('Upmedia', () => {
  let component: Upmedia;
  let fixture: ComponentFixture<Upmedia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Upmedia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Upmedia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
