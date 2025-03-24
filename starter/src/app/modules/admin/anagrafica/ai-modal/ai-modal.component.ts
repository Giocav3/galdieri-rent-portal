import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, UntypedFormBuilder, Validators, FormArray, ReactiveFormsModule, FormsModule, FormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIcon,
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
    ]
})
export class AiModalComponent implements OnDestroy, OnInit {
  form: FormGroup;
  clientTypes = ['Azienda', 'Persona Fisica'];
  composeForm: UntypedFormGroup;

  // Soggetto per gestire la distruzione delle sottoscrizioni
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private _formBuilder: UntypedFormBuilder,
    private router: Router,
    public matDialogRef: MatDialogRef<AiModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    console.log("Dati ricevuti nella modal:", data);


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

  async onSubmit(): Promise<void> {
    if (this.form.valid) {
        const url: string = "https://giovannicavaliere.app.n8n.cloud/webhook-test/generate";
      
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ piva: this.form.get('piva')?.value }), // Assumendo che "piva" sia il valore del campo "contact"
          });
      
          
          console.log("Status Code:", response.status);
        } catch (error) {
          console.error("Fetch error:", error);
        }
    }
  }

  onCancel(): void {
    // Chiude il dialog senza salvare
  }
}