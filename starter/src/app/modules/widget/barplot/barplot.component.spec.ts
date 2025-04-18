import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarplotComponent } from './barplot.component';

describe('BarplotComponent', () => {
  let component: BarplotComponent;
  let fixture: ComponentFixture<BarplotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarplotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
