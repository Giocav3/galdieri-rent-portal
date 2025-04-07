import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { ScrumboardBoardComponent } from 'app/modules/project-management/board/board.component';
import { ScrumboardBoardsComponent } from 'app/modules/project-management/boards/boards.component';
import { ScrumboardCardComponent } from 'app/modules/project-management/card/card.component';
import { Board } from 'app/modules/project-management/project-management.models';
import { ProjectManagementService } from 'app/modules/project-management/project-management.service';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * Board resolver
 *
 * @param route
 * @param state
 */
const boardResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<Board> => {
    const projectManagementService = inject(ProjectManagementService);
    const router = inject(Router);

    return projectManagementService.getBoard(route.paramMap.get('boardId')).pipe(
        // Error here means the requested board is not available
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
 * Card resolver
 *
 * @param route
 * @param state
 */
const cardResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const projectManagementService = inject(ProjectManagementService);
    const router = inject(Router);

    return projectManagementService.getCard(route.paramMap.get('cardId')).pipe(
        // Error here means the requested card is not available
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

export default [
    {
        path: '',
        component: ScrumboardBoardsComponent,
        resolve: {
            boards: () => inject(ProjectManagementService).getBoards(),
        },
    },
    {
        path: ':boardId',
        component: ScrumboardBoardComponent,
        resolve: {
            board: boardResolver,
        },
        children: [
            {
                path: 'card/:cardId',
                component: ScrumboardCardComponent,
                resolve: {
                    card: cardResolver,
                },
            },
        ],
    },
] as Routes;
