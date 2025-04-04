import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    signal,
    inject,
    ChangeDetectionStrategy,
    OnInit,
    ViewEncapsulation,
    ChangeDetectorRef,
    OnDestroy
  } from '@angular/core';
  import { CommonModule, DatePipe, NgClass } from '@angular/common';
  import { MatIconModule } from '@angular/material/icon';
  import { MatTooltipModule } from '@angular/material/tooltip';
  import { MatDividerModule } from '@angular/material/divider';
  import { StakeholdersListService } from '../list/list.service';
  import { MatToolbarModule } from '@angular/material/toolbar';
  import {MatExpansionModule} from '@angular/material/expansion';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { Subject, takeUntil } from 'rxjs';
import { StakeholdersListComponent } from '../list/list.component';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { fuseAnimations } from '@fuse/animations';


  @Component({
    selector: 'stakeholder-details',
    imports: [
      MatButtonModule,
              MatTooltipModule,
              RouterLink,
              MatIconModule,
              FormsModule,
              ReactiveFormsModule,
              MatRippleModule,
              MatFormFieldModule,
              MatInputModule,
              MatCheckboxModule,
              NgClass,
              MatSelectModule,
              MatOptionModule,
              MatDatepickerModule,
              TextFieldModule,
              FuseFindByKeyPipe,
              DatePipe,
    ],
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
        
    templateUrl: './details.component.html',
  })
  export class StakeHolderDetails implements OnInit, OnDestroy {
    contact!: any;
    relatedStakeholders!: any;
    @Output() close = new EventEmitter<void>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    editMode = false
    personalForm: UntypedFormGroup;
    companyForm: UntypedFormGroup;
    userForm: UntypedFormGroup;
    matchedStakeholders = signal<any[]>([]);
    loadingMatches = signal(false);
    readonly panelOpenState = signal(false);

    stakeholderTypeMap: Record<string, { color?: 'primary' | 'accent' | 'warn', icon: string, tooltip: string }> = {
      'Fornitore': {
        color: 'accent',
        icon: 'local_shipping',
        tooltip: 'Fornisce beni o servizi'
      },
      'Cliente': {
        color: 'accent',
        icon: 'shopping_cart',
        tooltip: 'Acquista prodotti o servizi'
      },
      'Dipendente': {
        color: 'accent',
        icon: 'badge',
        tooltip: 'Fa parte del team'
      },
      'Utilizzatore': {
        color: 'accent',
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

    companyFormFields = [
      { key: 'companyName', label: 'Ragione Sociale', icon: 'business' },
      { key: 'vatNumber', label: 'Partita IVA', icon: 'receipt' },
      { key: 'phone', label: 'Telefono', icon: 'call' },
      { key: 'email', label: 'Email', icon: 'email' },
      { key: 'region', label: 'Regione', icon: 'public' },
      { key: 'province', label: 'Provincia', icon: 'map' },
      { key: 'common', label: 'Comune', icon: 'location_city' },
      { key: 'cap', label: 'CAP', icon: 'mail' },
      { key: 'houseNumber', label: 'Civico', icon: 'pin' },
      { key: 'address', label: 'Indirizzo', icon: 'home' },
      { key: 'latitude', label: 'Latitudine', icon: 'my_location' },
      { key: 'longitude', label: 'Longitudine', icon: 'my_location' },
      { key: 'pec', label: 'PEC', icon: 'mark_email_read' },
      { key: 'sdiCode', label: 'Codice SDI', icon: 'code' }
  ];
  
  userFormFields = [
      { key: 'iban', label: 'IBAN', icon: 'account_balance' },
      { key: 'businessSector', label: 'Settore', icon: 'work' },
      { key: 'from', label: 'Da', icon: 'calendar_today', type: 'date' },
      { key: 'convention', label: 'Convenzione', icon: 'handshake' }
  ];
    

    constructor(
      private snackBar: MatSnackBar,
      private fb: UntypedFormBuilder,
      private _changeDetectorRef: ChangeDetectorRef,
      private router: Router,
      private _stakeholderService: StakeholdersListService,
      private _stakeholdersListComponent: StakeholdersListComponent,
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

      this.companyForm = this.fb.group({
        companyName: [''],
        vatNumber: [''],
        phone: [''],
        email: [''],
        region: [''],
        province: [''],
        common: [''],
        cap: [''],
        houseNumber: [''],
        address: [''],
        latitude: [''],
        longitude: [''],
        pec: [''],
        sdiCode: ['']
      });

      this.userForm = this.fb.group({
        iban: [''],
        businessSector: [''],
        from: [''],
        convention: ['']
      });
    }

    getStakeholderConfig(type: string) {
      return this.stakeholderTypeMap[type] || {
        color: undefined,
        icon: 'help',
        tooltip: 'Tipo sconosciuto'
      };
    }

    ngOnInit(): void {
      // Get the contact
      this._stakeholderService.contact$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((contact: any) => {
        this.contact = contact;
        console.log('📞 Contact ricevuto:', contact);
    
        this._stakeholdersListComponent?.matDrawer?.open();
    
        this.updateFormsFromContact(contact);
        this.loadRelatedStakeholdersIfNeeded(contact);
    
        this.toggleEditMode(false);
        this._changeDetectorRef.markForCheck();
    });

    }


    private updateFormsFromContact(contact: any): void {
      if (contact.personalData) this.personalForm.patchValue(contact.personalData);
      if (contact.companyData) this.companyForm.patchValue(contact.companyData);
      if (contact.userDetails) this.userForm.patchValue(contact.userDetails);
    }
    
    private loadRelatedStakeholdersIfNeeded(contact: any): void {
      if (contact.personalData?.id && contact.companyData?.id) {

        this.expandedSections = {
          company: false,
          personal: false,
          additional: false,
          related: false
        };

        this._stakeholderService
          .getStakeholdersByCompanyAndPersonal(
            contact.companyData.id,
            contact.personalData.id
          )
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((response) => {
            console.log('📦 Stakeholders correlati:', response);
            this.relatedStakeholders = response;
            this._changeDetectorRef.markForCheck();
          });
      }
    }


    expandedSections = {
      company: false,
      personal: false,
      additional: false,
      related: false
    };

    toggleSection(section: keyof typeof this.expandedSections): void {
        this.expandedSections[section] = !this.expandedSections[section];
        this._changeDetectorRef.markForCheck();
    }
    

    /**
     * On destroy
     */
    ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //   if (changes['contact'] && this.contact?.stakeholder) {
    //     console.log('▶️ Stakeholder aggiornato:', JSON.stringify(this.contact,null,2));
    //     this.loadMatches();
    //   }
    // }

    // toggleEditMode(value: boolean) {
    //   this.editMode = value;
    
    //   if (value) {
    //     const match = this.matchedStakeholders()[0];
    //     if (match?.personalData) {
    //       this.personalForm.patchValue(match.personalData);
    //     }
    //   }
    // }

    toggleEditMode(editMode: boolean | null = null): void {
      if (editMode === null) {
          this.editMode = !this.editMode;
      } else {
          this.editMode = editMode;
      }

      // Mark for check
      this._changeDetectorRef.markForCheck();
    }
    
    savePersonalData() {
      console.log('📝 Dati anagrafici salvati:', this.personalForm.getRawValue());
      this.toggleEditMode(false);
    }
    
    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
      return this._stakeholdersListComponent.matDrawer.close();
    }
     
    //METODO DI CHIUSURA
    closePanel() {
      this.close.emit();
    }

    //METODO PER PRENDERE LE INIZIALI 
    // getInitialsFromString(value?: string): string {
    //   if (!value) return '—';
    //   const parts = value.trim().split(' ');
    //   if (parts.length === 1) return parts[0][0].toUpperCase();
    //   return (parts[0][0] + parts[1][0]).toUpperCase();
    // }
    
  
    copyToClipboard(value: string): void {
      if (navigator.clipboard && value) {
        navigator.clipboard.writeText(value).then(() => {
          this.snackBar.open('Valore copiato negli appunti!', 'Chiudi', { duration: 2000 });
        });
      }
    }

    // loadMatches() {
    //   const matchIds = this.contact?.matches?.map(m => m.id) || [];
    //   if (!matchIds.length) {
    //     console.log('ℹ️ Nessun match presente');
    //     this.matchedStakeholders.set([]);
    //     return;
    //   }
  
    //   this.loadingMatches.set(true);
  
    //   const observables = matchIds.map(id => {
    //     this._stakeholderService.getStakeholderById(id)
    //   }
    //   );
  
    //   Promise.all(observables.map(obs => obs.toPromise()))
    //     .then(results => {
    //       console.log('✅ Match caricati:', JSON.stringify(results,null,2));
    //       this.matchedStakeholders.set(results);
    //       console.log('matchedStakeholders',this.matchedStakeholders)
    //       this.loadingMatches.set(false);
    //     })
    //     .catch(error => {
    //       console.error('❌ Errore nel caricamento dei match:', error);
    //       this.loadingMatches.set(false);
    //     });
    // }

     /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
     trackByFn(index: number, item: any): any {
      return item.id || index;
    }

  }
  