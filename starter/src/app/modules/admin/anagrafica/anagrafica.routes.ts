import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { ContactsDetailsComponent } from './details/details.component';
import { ContactsListComponent } from './list/list.component';
import { AnagraficaService } from './anagrafica.service';
import { catchError, throwError } from 'rxjs';
import { AnagraficaComponent } from './anagrafica.component';
import { ExampleComponent } from '../example/example.component';

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
    const anagraficaService = inject(AnagraficaService);
    const router = inject(Router);

    return anagraficaService.getContactById(route.paramMap.get('id')).pipe(
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
    );
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
    component: ContactsDetailsComponent,
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
    if (!nextState.url.includes('/anagrafica')) {
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
        component: AnagraficaComponent,
        resolve: {
            tags: () => inject(AnagraficaService).getTags(),
        },
        children: [
            {
                path: '',
                component: ContactsListComponent,
                resolve: {
                    contacts: () => inject(AnagraficaService).getContacts(),
                    countries: () => inject(AnagraficaService).getCountries(),
                },
                children: [
                    {
                        path: ':id',
                        component: ContactsDetailsComponent,
                        resolve: {
                            contact: contactResolver,
                            countries: () =>
                                inject(AnagraficaService).getCountries(),
                        },
                        canDeactivate: [canDeactivateContactsDetails],
                    },
                    {
                        path: 'generate/:id',
                        component: ExampleComponent,
                        
                    }
                ],
            },
        ],
    },
] as Routes;
