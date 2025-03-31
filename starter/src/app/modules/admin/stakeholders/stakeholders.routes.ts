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
        data: {
            breadcrumb: 'Dashboard', // 👈 AGGIUNTO
        },
        resolve: {
            data: () => inject(StakeholdersService).getStakeholderCountByType(),
        },
    },
    {
        path: 'new',
        component: StakeholderFormComponent,
        // data: {
        //     breadcrumb: 'Crea', // 👈 AGGIUNTO
        // },
        // resolve: {
        //     data: () => inject(StakeholdersService).getStakeholderCountByType(),
        // },
    },
] as Routes;
