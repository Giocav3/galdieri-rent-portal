import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    signal,
    inject
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { MatIconModule } from '@angular/material/icon';
  import { MatTooltipModule } from '@angular/material/tooltip';
  import { MatDividerModule } from '@angular/material/divider';
  import { StakeholdersService } from '../stakeholders.service';
  
  @Component({
    selector: 'app-details',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule, MatDividerModule],
    templateUrl: './details.component.html',
  })
  export class StakeHolderDetails implements OnChanges {
    @Input() contact!: any;
    @Output() close = new EventEmitter<void>();
  
    private stakeholdersService = inject(StakeholdersService);
  
    matchedStakeholders = signal<any[]>([]);
    loadingMatches = signal(false);
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['contact'] && this.contact?.stakeholder) {
        console.log('▶️ Stakeholder aggiornato:', JSON.stringify(this.contact,null,2));
        this.loadMatches();
      }
    }
  
    closePanel() {
      this.close.emit();
    }
  
    getInitials(data?: any): string {
        if (!data?.name && !data?.surname) return '—';
        return ((data?.name?.[0] || '') + (data?.surname?.[0] || '')).toUpperCase();
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
          this.loadingMatches.set(false);
        })
        .catch(error => {
          console.error('❌ Errore nel caricamento dei match:', error);
          this.loadingMatches.set(false);
        });
    }
  }
  