import { TestBed } from '@angular/core/testing';

import { StakeholdersListService } from './list.service';

describe('StakeholdersService', () => {
  let service: StakeholdersListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StakeholdersListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
