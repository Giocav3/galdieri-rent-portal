import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation, TemplateRef, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, UntypedFormBuilder, Validators, FormArray, ReactiveFormsModule, FormsModule, FormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { QuillEditorComponent } from 'ngx-quill';
import { AiModalComponent } from '../anagrafica/ai-modal/ai-modal.component';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseLoadingService } from '@fuse/services/loading';
import { FuseAlertComponent, FuseAlertService, FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipListbox } from '@angular/material/chips';


@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    styleUrls: ['./example.component.css'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIcon,
        MatChipsModule,
        MatChipListbox,
        MatMenuModule,
        MatToolbarModule,
        MatDivider,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatLabel,
        FormsModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        QuillEditorComponent,
        FuseLoadingBarComponent,
        FuseAlertComponent
    ]
})
export class ExampleComponent implements OnDestroy, OnInit {
  form: FormGroup;
  selectedTab: string = 'online';
  clientTypes = ['Azienda', 'Persona Fisica'];
  composeForm: UntypedFormGroup;
  private _fuseLoadingService = inject(FuseLoadingService);
  private _fuseAlertService = inject(FuseAlertService);
  private _fuseConfirmationService = inject(FuseConfirmationService);
  @ViewChild('loadingModal') loadingModal: TemplateRef<any>;
  typeAlert: FuseAlertType
  alertTitle: string;
  alertMessage: string;
  chips = [
    { label: 'All', value: 'all', count: 21 },
    { label: 'Online', value: 'online', count: 16 },
    { label: 'Offline', value: 'offline', count: 3 },
    { label: 'Favorite', value: 'favorite', count: 32 }
          ];



  // Soggetto per gestire la distruzione delle sottoscrizioni
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private _formBuilder: UntypedFormBuilder,
    private router: Router,
    private _changeDetectorRef: ChangeDetectorRef,    
  ) {

    this.form = this.fb.group({
        clientType: new FormControl(''), // Inizializzato con stringa vuota
        piva: new FormControl(''),
        cf: new FormControl(''),
        emails: this.fb.array([]),
        phoneNumbers: this.fb.array([])
      });
  }

  ngOnInit(): void {
    // Inizializza il form
    this.form = this._formBuilder.group({
      clientType: ['', Validators.required],
      piva: [''],
      cf: [''],
      emails: this._formBuilder.array([]), // Array per le email
      phoneNumbers: this._formBuilder.array([]) // Array per i numeri di telefono
    });

    // Sottoscrizione ai cambiamenti del campo 'clientType'
    this.form.get('clientType').valueChanges
      .pipe(takeUntil(this._unsubscribeAll)) // Annulla la sottoscrizione quando il componente viene distrutto
      .subscribe(value => {
        if (value === 'Azienda') {
          this.form.get('piva').setValidators([Validators.required]);
          this.form.get('cf').clearValidators();
        } else {
          this.form.get('cf').setValidators([Validators.required]);
          this.form.get('piva').clearValidators();
        }
        this.form.get('piva').updateValueAndValidity();
        this.form.get('cf').updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    // Distrugge le sottoscrizioni
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  async onSubmit(): Promise<any> {
    if (this.form.valid) {
      this.showLoadingBar();
      const url: string = "http://localhost:5678/webhook-test/generate-company";
  
      const bodyReq = this.form.get('piva')?.value
        ? { piva: this.form.get('piva')?.value.toLowerCase() }
        : this.form.get('cf')?.value
        ? { cf: this.form.get('cf')?.value.toLowerCase() }
        : null;
  
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyReq)
        });
  
        const data = await response.json();
        console.log("res json", data);
  
        if (response.status === 409) {
          if (data.message?.toLowerCase().includes("già presente")) {
            this.typeAlert = 'warning';
            this.showConfirmationDialog('Attenzione', data.message, 'warning');
          } else {
            this.typeAlert = 'success';
            this.showConfirmationDialog('Successo', data.message, 'success');
          }
        } else if ( response.status === 200 ){
          this.showConfirmationDialog('Successo', data.message, 'success');
        }
  
      } catch (error) {
        console.error("Fetch error:", error);
        this.typeAlert = 'error';
        this.showConfirmationDialog('Errore', 'Si è verificato un errore durante l\'operazione.', 'error');
      } finally {
        this.hideLoadingBar();
      }
    }
  }
  

  // openAiFormModal(data: any): void {
  //   const dialogRef = this.dialog.open(AiModalComponent, {
  //     width: '500px', // Imposta la larghezza della modal
  //     data: data // Passa i dati ricevuti dalla response
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('La modal è stata chiusa', result);
  //   });
  // }

  onCancel(): void {
    // Chiude il dialog senza salvare
  }


  showLoadingBar(): void {
      this._fuseLoadingService.show();
  }

  /**
   * Hide the loading bar
   */
  hideLoadingBar(): void {
      this._fuseLoadingService.hide();
  }

  showAlert(name: string, type: FuseAlertType, message: string): void {
    this.typeAlert = type; // Imposta il tipo di alert
    this._fuseAlertService.show(name); // Mostra l'alert
    console.log(`${name} ${type} ${message}`)
    this._changeDetectorRef.detectChanges()
  }

  hideAlert(name: string): void {
      this._fuseAlertService.dismiss(name);
      console.log(`${name}`)
  }

  showConfirmationDialog(title: string, message: string, type: 'success' | 'warning' | 'error'): void {
    const dialogRef = this._fuseConfirmationService.open({
      title,
      message,
      icon: {
        show: true,
        name: type === 'success' ? 'check_circle' : type === 'warning' ? 'warning' : 'error',
        color: type
      },
      actions: {
        confirm: {
          show: true,
          label: 'OK',
          color: 'primary'
        },
        cancel: {
          show: false,
        }
      },
      dismissible: true
    });

    dialogRef.afterClosed().subscribe((result) => {
        console.log('Dialog chiuso con:', result);
    });
  }

}