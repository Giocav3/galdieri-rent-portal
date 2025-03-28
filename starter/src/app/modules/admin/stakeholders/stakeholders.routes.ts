import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { StakeholdersComponent } from './stakeholders.component';
import { StakeholdersService } from './stakeholders.service';
import { StakeholderFormComponent } from './stakeHolders-form/stakeholder-form.component';

export default [
    {
        path: '',
        component: StakeholdersComponent,
        data: {
            breadcrumb: 'Dashboard', // 👈 AGGIUNTO
        },
        resolve: {
            data: () => inject(StakeholdersService).getStakeholderDashboard(),
        },
    },
    {
        path: 'new',
        component: StakeholderFormComponent,
        // data: {
        //     breadcrumb: 'Crea', // 👈 AGGIUNTO
        // },
        // resolve: {
        //     data: () => inject(StakeholdersService).getStakeholderDashboard(),
        // },
    },
] as Routes;
