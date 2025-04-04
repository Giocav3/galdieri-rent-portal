import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { StakeholdersListComponent } from './list/list.component';
import { StakeHolderDetails } from './details/details.component';
import { StakeholderFormComponent } from './stakeHolders-form/stakeholder-form.component';
import { StakeholdersListService } from './list/list.service';
import { StakeholdersComponent } from './stakeholders.component';
import { catchError, switchMap, throwError } from 'rxjs';

/**
 * Contact resolver
 *
 * @param route
 * @param state
 */
const contactResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const stakeholdersService = inject(StakeholdersListService);
    const router = inject(Router);

    return stakeholdersService.getStakeholderById(route.paramMap.get('id')).pipe(
        // Error here means the requested contact is not available
        
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    )
};

/**
 * Can deactivate contacts details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateContactsDetails = (
    component: StakeHolderDetails,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/contacts'
    // it means we are navigating away from the
    // contacts app
    if (!nextState.url.includes('/stakeholders')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another contact...
    if (nextRoute.paramMap.get('id')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

export default [
    {
        path: '',
        component: StakeholdersComponent,
        children: [
            {
                path: '',
                component: StakeholdersListComponent,
                data: {
                    breadcrumb: 'Dashboard', // 👈 AGGIUNTO
                },
                resolve: {
                    data: () => inject(StakeholdersListService).getStakeholderCountByType(),
                },
                children: [
                    {
                        path: ':id',
                        component: StakeHolderDetails,
                        resolve: {
                            contact: contactResolver,
                        },
                        canDeactivate: [canDeactivateContactsDetails],
                    },
                ]
            },
        ]
    },
    {
        path: 'new',
        component: StakeholderFormComponent,
        // data: {
        //     breadcrumb: 'Crea', // 👈 AGGIUNTO
        // },
        // resolve: {
        //     data: () => inject(StakeholdersListService).getStakeholderCountByType(),
        // },
    },
    
] as Routes;

