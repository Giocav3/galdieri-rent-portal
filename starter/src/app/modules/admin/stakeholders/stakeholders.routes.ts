import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { StakeholdersComponent } from './stakeholders.component';
import { StakeholdersService } from './stakeholders.service';

export default [
    {
        path: '',
        component: StakeholdersComponent,
        resolve: {
            data: () => inject(StakeholdersService).getStakeholderCountByType(),
        },
    },
] as Routes;
