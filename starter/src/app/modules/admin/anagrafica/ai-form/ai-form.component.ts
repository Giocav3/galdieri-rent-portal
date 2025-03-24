import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ai-contact-modal',
  templateUrl: './ai-contact-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  standalone: true,
})
export class AiContactModalComponent implements OnDestroy, OnInit {
  form: FormGroup;
  clientTypes = ['Azienda', 'Persona Fisica'];

  // Soggetto per gestire la distruzione delle sottoscrizioni
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AiContactModalComponent>,
    private _formBuilder: UntypedFormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Inizializza il form
    // Create the contact form
    

    this.form = this._formBuilder.group({
      clientType: ['', Validators.required],
      piva: [''],
      cf: ['']
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

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    console.log('Aoo')
    this.dialogRef.close();
  }
}