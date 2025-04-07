import { CdkScrollable } from '@angular/cdk/scrolling';
import { NewProjectComponent } from '../new-project/new-project.component';
import { MatDialog } from '@angular/material/dialog';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Board } from 'app/modules/project-management/project-management.models';
import { ProjectManagementService } from 'app/modules/project-management/project-management.service';
import { DateTime } from 'luxon';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'scrumboard-boards',
    templateUrl: './boards.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CdkScrollable, RouterLink, MatIconModule],
})
export class ScrumboardBoardsComponent implements OnInit, OnDestroy {
    boards: Board[];

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _scrumboardService: ProjectManagementService,
        private dialog: MatDialog
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the boards
        this._scrumboardService.boards$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((boards: Board[]) => {
                this.boards = boards;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Format the given ISO_8601 date as a relative date
     *
     * @param date
     */
    formatDateAsRelative(date: string): string {
        return DateTime.fromISO(date).toRelative();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    createNewProject() {
        const dialogRef = this.dialog.open(NewProjectComponent, {
            width: '500px',
            disableClose: true,
            autoFocus: false,
          });
        
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              console.log('Nuovo progetto:', result);
              // Salva o invia i dati
            }
          });
    }
}
