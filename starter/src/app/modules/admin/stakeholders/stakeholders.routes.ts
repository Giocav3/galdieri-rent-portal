import { Routes } from '@angular/router';
import { inject } from '@angular/core';

import { StakeholdersComponent } from './stakeholders.component';
import { StakeHolderDetails } from './details/details.component';
import { StakeholderFormComponent } from './stakeHolders-form/stakeholder-form.component';
import { StakeholdersService } from './stakeholders.service';

export default [
  {
    path: '',
    component: StakeholdersComponent,
    resolve: {
      data: () => inject(StakeholdersService).getStakeholderCountByType(),
    },
    children: [
      {
        path: ':id',
        component: StakeHolderDetails,
      }
    ]
  },
  {
    path: 'new',
    component: StakeholderFormComponent,
  }
] as Routes;
