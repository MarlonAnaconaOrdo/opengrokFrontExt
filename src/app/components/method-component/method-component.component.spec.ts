import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodComponentComponent } from './method-component.component';

describe('MethodComponentComponent', () => {
  let component: MethodComponentComponent;
  let fixture: ComponentFixture<MethodComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MethodComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
