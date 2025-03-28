import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    signal,
    inject,
    ChangeDetectionStrategy
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { MatIconModule } from '@angular/material/icon';
  import { MatTooltipModule } from '@angular/material/tooltip';
  import { MatDividerModule } from '@angular/material/divider';
  import { StakeholdersService } from '../stakeholders.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';

  
  @Component({
    selector: 'app-details',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule, MatDividerModule,MatToolbarModule,MatExpansionModule],
    changeDetection: ChangeDetectionStrategy.OnPush,

    templateUrl: './details.component.html',
  })
  export class StakeHolderDetails implements OnChanges {
    @Input() contact!: any;
    @Output() close = new EventEmitter<void>();
  
    private stakeholdersService = inject(StakeholdersService);
    editMode = false
    matchedStakeholders = signal<any[]>([]);
    loadingMatches = signal(false);
    readonly panelOpenState = signal(false);
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['contact'] && this.contact?.stakeholder) {
        console.log('▶️ Stakeholder aggiornato:', JSON.stringify(this.contact,null,2));
        this.loadMatches();
      }
    }

    toggleEditMode(value: boolean) {
      this.editMode = value;
    }
    
  //METODO DI CHIUSURA
    closePanel() {
      this.close.emit();
    }
    //METODO PER PRENDERE LE INIZIALI 
    getInitialsFromString(value?: string): string {
      if (!value) return '—';
      const parts = value.trim().split(' ');
      if (parts.length === 1) return parts[0][0].toUpperCase();
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    
  
    loadMatches() {
      const matchIds = this.contact?.matches?.map(m => m.id) || [];
      if (!matchIds.length) {
        console.log('ℹ️ Nessun match presente');
        this.matchedStakeholders.set([]);
        return;
      }
  
      this.loadingMatches.set(true);
  
      const observables = matchIds.map(id =>
        this.stakeholdersService.getStakeholderById(id)
      );
  
      Promise.all(observables.map(obs => obs.toPromise()))
        .then(results => {
          console.log('✅ Match caricati:', JSON.stringify(results,null,2));
          this.matchedStakeholders.set(results);
          console.log('matchedStakeholders',this.matchedStakeholders)
          this.loadingMatches.set(false);
        })
        .catch(error => {
          console.error('❌ Errore nel caricamento dei match:', error);
          this.loadingMatches.set(false);
        });
    }
  }
  