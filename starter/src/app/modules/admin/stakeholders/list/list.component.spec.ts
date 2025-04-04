import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholdersListComponent } from './list.component';

describe('StakeholdersComponent', () => {
  let component: StakeholdersListComponent;
  let fixture: ComponentFixture<StakeholdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StakeholdersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StakeholdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
