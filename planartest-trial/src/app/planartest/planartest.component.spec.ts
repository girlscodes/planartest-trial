import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanartestComponent } from './planartest.component';

describe('PlanartestComponent', () => {
  let component: PlanartestComponent;
  let fixture: ComponentFixture<PlanartestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanartestComponent]
    });
    fixture = TestBed.createComponent(PlanartestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
