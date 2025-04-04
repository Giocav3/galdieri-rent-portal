import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'stakeholders',
    templateUrl: './stakeholders.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet],
})
export class StakeholdersComponent {
    /**
     * Constructor
     */
    constructor() {}
}
