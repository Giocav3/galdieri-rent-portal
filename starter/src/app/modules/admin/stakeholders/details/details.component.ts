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
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { FormBuilder, FormGroup } from '@angular/forms';


  
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
    personalForm: FormGroup;
    matchedStakeholders = signal<any[]>([]);
    loadingMatches = signal(false);
    readonly panelOpenState = signal(false);

    stakeholderTypeMap: Record<string, { color?: 'primary' | 'accent' | 'warn', icon: string, tooltip: string }> = {
      'Fornitore': {
        color: 'primary',
        icon: 'local_shipping',
        tooltip: 'Fornisce beni o servizi'
      },
      'Cliente': {
        color: 'accent',
        icon: 'shopping_cart',
        tooltip: 'Acquista prodotti o servizi'
      },
      'Dipendente': {
        color: 'warn',
        icon: 'badge',
        tooltip: 'Fa parte del team'
      },
      'Utilizzatore': {
        color: undefined,
        icon: 'person',
        tooltip: 'Usa i nostri servizi'
      }
    };
    personalFormFields = [
      { key: 'name', label: 'Nome', icon: 'person' },
      { key: 'surname', label: 'Cognome', icon: 'person' },
      { key: 'fiscalCode', label: 'Codice fiscale', icon: 'badge' },
      { key: 'email', label: 'Email', icon: 'email' },
      { key: 'phone', label: 'Telefono', icon: 'call' },
      { key: 'gender', label: 'Sesso', icon: 'wc' },
      { key: 'birthday', label: 'Data di nascita', icon: 'calendar_today', type: 'date' },
      { key: 'birthPlace', label: 'Luogo di nascita', icon: 'place' },
      { key: 'birthCounty', label: 'Provincia nascita', icon: 'location_city' },
      { key: 'title', label: 'Titolo di studio', icon: 'school' },
      { key: 'address', label: 'Indirizzo', icon: 'home' },
      { key: 'houseNumber', label: 'Civico', icon: 'pin' },
      { key: 'cap', label: 'CAP', icon: 'mail' },
      { key: 'province', label: 'Provincia', icon: 'map' },
      { key: 'common', label: 'Comune', icon: 'location_city' },
      { key: 'region', label: 'Regione', icon: 'public' },
      { key: 'latitude', label: 'Latitudine', icon: 'my_location' },
      { key: 'longitude', label: 'Longitudine', icon: 'my_location' }
    ];
    

    constructor(
      private snackBar: MatSnackBar,
      private fb: FormBuilder
    ) {
      this.personalForm = this.fb.group({
        name: [''],
        surname: [''],
        fiscalCode: [''],
        email: [''],
        phone: [''],
        gender: [''],
        birthday: [''],
        birthPlace: [''],
        birthCounty: [''],
        title: [''],
        address: [''],
        houseNumber: [''],
        cap: [''],
        province: [''],
        common: [''],
        region: [''],
        latitude: [''],
        longitude: [''],
      });
    }

    getStakeholderConfig(type: string) {
      return this.stakeholderTypeMap[type] || {
        color: undefined,
        icon: 'help',
        tooltip: 'Tipo sconosciuto'
      };
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['contact'] && this.contact?.stakeholder) {
        console.log('▶️ Stakeholder aggiornato:', JSON.stringify(this.contact,null,2));
        this.loadMatches();
      }
    }

    toggleEditMode(value: boolean) {
      this.editMode = value;
    
      if (value) {
        const match = this.matchedStakeholders()[0];
        if (match?.personalData) {
          this.personalForm.patchValue(match.personalData);
        }
      }
    }
    
    savePersonalData() {
      console.log('📝 Dati anagrafici salvati:', this.personalForm.getRawValue());
      this.toggleEditMode(false);
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
    
  
    copyToClipboard(value: string): void {
      if (navigator.clipboard && value) {
        navigator.clipboard.writeText(value).then(() => {
          this.snackBar.open('Valore copiato negli appunti!', 'Chiudi', { duration: 2000 });
        });
      }
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
  