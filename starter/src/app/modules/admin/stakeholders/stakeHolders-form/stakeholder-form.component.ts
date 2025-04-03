import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { FuseLoadingService } from '@fuse/services/loading';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stakeholder-form',
  templateUrl: './stakeholder-form.component.html',
  styleUrls: ['./stakeholder-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  standalone: true
})
export class StakeholderFormComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;
  private stakeholderTypeSubscription: Subscription;
  form!: UntypedFormGroup;
  showPersonalDataDetails: boolean = false;
  showCompanyDataDetails: boolean = false;
  isCheckingFiscalCode: boolean = false;
  isCheckingVatNumber: boolean = false;
  stakeholderTypes = ['Cliente', 'Fornitore', 'Dipendente', 'Utilizzatore'];
  personaTypes = [
    'Ditta individuale', 'Libero professionista', 'Società di persone',
    'Società di capitali', 'Associazione non riconosciuta', 'Associazione studi associati',
    'Socio d\'azienda', 'Persona fisica'
  ];

  personalDataMock = [
    { 
      name: "Danilo",
      surname: "Nitti",
      fiscalCode: "ixipnu10n48o191K",
      email: "ngiradello@natta-scamarcio.com",
      phone: "+39 84 9827125",
      gender: "M",
      birthday: "1978-05-14",
      birthPlace: "Arturo calabro",
      birthCounty: "FE",
      title: "Sig.",
      address: "Contrada Enzio",
      cap: "13622",
      province: "RG",
      common: "Fiorucci calabro",
      region: "Liguria",
      houseNumber: "9",
      latitude: 72.177022,
      longitude: 156.839806
    }
  ];
  
  companyDataMock = [
    {
      companyName: "Dandolo, Marini e Badoglio Group",
      vatNumber: "IT67607616199",
      phone: "+39 69 0230788",
      email: "caterina22@sonnino.com",
      region: "Emilia-Romagna",
      province: "NO",
      common: "Cabrini veneto",
      cap: "03167",
      houseNumber: "04",
      address: "Via Ninetta",
      latitude: -86.12991,
      longitude: 107.320166,
      pec: "michelotto83@vodafone.it",
      sdiCode: "cfx3369"
    }
  ];
  typeAlert: string;

  constructor(private _formBuilder: UntypedFormBuilder, private _fuseLoadingService: FuseLoadingService) {}

  ngOnInit(): void {
    this.initForm()
    this.stakeholderTypeSubscription = this.form.get('step1.stakeholderType')?.valueChanges.subscribe(type => {
      this.updateUserDetailsForm(type);
    });
  }

  ngOnDestroy(): void {
    if (this.stakeholderTypeSubscription) {
      this.stakeholderTypeSubscription.unsubscribe();
    }
    // Altri clean-up di observable o altro per evitare memory leak
  }

  private initForm(): void {
    this.form = this._formBuilder.group({
      step1: this._formBuilder.group({
        stakeholderType: [null, Validators.required]
      }),
      step2: this._formBuilder.group({
        type: [null, Validators.required],
      }),
      step3: this._formBuilder.group({
        fiscalCode: [''],
        name: [''], 
        surname: [''], 
        email: [''], 
        phone: [''], 
        gender: [''], 
        birthday: [''],
        birthPlace: [''], 
        birthCounty: [''], 
        title: [''], 
        address: [''], 
        cap: [''],
        province: [''], 
        common: [''], 
        region: [''], 
        houseNumber: [''],
        latitude: [''], 
        longitude: ['']
      }),
      step4: this._formBuilder.group({
        vatNumber: [''],
        companyName: [''], 
        email: [''], 
        phone: [''],
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
      }),
      step5: this._formBuilder.group({})
    });
  }

  showLoadingBar(): void {
    this._fuseLoadingService.show();
  }

  hideLoadingBar(): void {
    this._fuseLoadingService.hide();
  }

  private checkVatNumber(): AsyncValidatorFn {
    return async (control: AbstractControl) => {
      if (!control.value) {
        this.showCompanyDataDetails = false;
        return null;
      }
      
      this.isCheckingVatNumber = true;
      try {
        const response = await fetch("http://localhost:5678/webhook/check-cf-piva", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            piva: control.value.toLowerCase(), 
            stakeholderType: this.form.get('step1.stakeholderType').value, 
            type: this.form.get('step2.type').value 
          })
        });

        const data = await response.json();
        this.isCheckingVatNumber = false;

        if (data.data) {
          const step4Form = this.form.get('step4') as FormGroup;
          
          Object.keys(data.data).forEach(key => {
            if (step4Form.contains(key)) {
              step4Form.get(key).setValue(data.data[key], { emitEvent: false });
            }
          });
          
          this.showCompanyDataDetails = true;
        }

        return null;
        
      } catch (error) {
        this.isCheckingVatNumber = false;
        console.error('Errore durante la verifica della P.IVA:', error);
        return null;
      }
    };
}

  private checkFiscalCode(): AsyncValidatorFn {
    return async (control: AbstractControl) => {
      if (!control.value) {
        this.showPersonalDataDetails = false; // Nascondi i dettagli se il campo è vuoto
        return null;
      }
      
      this.isCheckingFiscalCode = true;
      try {
        const response = await fetch("http://localhost:5678/webhook/check-cf-piva", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            cf: control.value.toLowerCase(), 
            stakeholderType: this.form.get('step1.stakeholderType').value, 
            type: this.form.get('step2.type').value 
          })
        });

        const data = await response.json();
        this.isCheckingFiscalCode = false;

        if (data.data) {
          const step3Form = this.form.get('step3') as FormGroup;
          
          // Patch dei valori solo per i campi esistenti nel form
          Object.keys(data.data).forEach(key => {
            if (step3Form.contains(key)) {
              step3Form.get(key).setValue(data.data[key], { emitEvent: false });
            }
          });
          
          this.showPersonalDataDetails = true;
        }

        // Non restituiamo errori di validazione (abbiamo rimosso i validatori)
        return null;
        
      } catch (error) {
        this.isCheckingFiscalCode = false;
        console.error('Errore durante la verifica del CF:', error);
        // Non restituiamo errori di validazione, ma potremmo mostrare un messaggio all'utente
        return null;
      }
    };
}
  
  isPersonaFisica(): boolean {
    const type = this.form.get('step2.type')?.value;
    return type === 'Persona fisica' || type === 'Socio d\'azienda';
  }

  async onFiscalCodeBlur(): Promise<void> {
    const fiscalCodeControl = this.form.get('step3.fiscalCode');
    const cf = fiscalCodeControl.value;
    
    if (!cf || cf.length < 11) { // Lunghezza minima per un CF valido
        this.showPersonalDataDetails = false;
        return;
    }

    // Evita chiamate duplicate se già in corso
    if (this.isCheckingFiscalCode) {
        return;
    }

    this.isCheckingFiscalCode = true;
    
    try {
        const response = await fetch("http://localhost:5678/webhook/check-cf-piva", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                cf: cf, 
                stakeholderType: this.form.get('step1.stakeholderType').value, 
                type: this.form.get('step2.type').value 
            })
        });

        const data = await response.json();
        
        if(response.status === 200) {
          return null
        }

        if (data.data) {
            const step3Form = this.form.get('step3') as FormGroup;
            
            Object.keys(data.data).forEach(key => {
                if (step3Form.contains(key)) {
                    step3Form.get(key).setValue(data.data[key], { emitEvent: false });
                }
            });
            
            this.showPersonalDataDetails = true;
        }
    } catch (error) {
        console.error('Errore durante la verifica del CF:', error);
        // Puoi mostrare un messaggio all'utente se necessario
    } finally {
        this.isCheckingFiscalCode = false;
    }
  }

  async onVatNumberBlur(): Promise<void> {
    const vatNumberControl = this.form.get('step4.vatNumber');
    const vat = vatNumberControl.value;
    console.log('vat', vat)
    if (!vat || vat.length < 11) { // Lunghezza minima per una P.IVA valida
        this.showCompanyDataDetails = false;
        return;
    }

    if (this.isCheckingVatNumber) {
        return;
    }

    this.isCheckingVatNumber = true;
    
    try {
        const response = await fetch("http://localhost:5678/webhook/check-cf-piva", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                piva: vat, 
                stakeholderType: this.form.get('step1.stakeholderType').value, 
                type: this.form.get('step2.type').value 
            })
        });

        const data = await response.json();
        
        if(response.status === 200) {
          return null
        }

        if (data.data) {
            const step4Form = this.form.get('step4') as FormGroup;
            
            Object.keys(data.data).forEach(key => {
                if (step4Form.contains(key)) {
                    step4Form.get(key).setValue(data.data[key], { emitEvent: false });
                }
            });
            
            this.showCompanyDataDetails = true;
        }
    } catch (error) {
        console.error('Errore durante la verifica della P.IVA:', error);
    } finally {
        this.isCheckingVatNumber = false;
    }
  }

  private updateUserDetailsForm(type: string): void {
    const userDetailsForm = this._formBuilder.group({});
    switch (type) {
      case 'Cliente':
        userDetailsForm.addControl('iban', this._formBuilder.control('', Validators.required));
        userDetailsForm.addControl('clientCode', this._formBuilder.control('', Validators.required));
        userDetailsForm.addControl('origin', this._formBuilder.control('', Validators.required));
        userDetailsForm.addControl('businessSector', this._formBuilder.control('', Validators.required));
        userDetailsForm.addControl('clientType', this._formBuilder.control('', Validators.required));
        userDetailsForm.addControl('agreement', this._formBuilder.control('', Validators.required));
        userDetailsForm.addControl('associatedConsultant', this._formBuilder.control('', Validators.required));
        userDetailsForm.addControl('documents', this._formBuilder.control('', Validators.required));
        userDetailsForm.addControl('sdiCode', this._formBuilder.control('', Validators.required));
        userDetailsForm.addControl('practices', this._formBuilder.control('', Validators.required));
        break;
      case 'Fornitore':
        userDetailsForm.addControl('paymentMethod', this._formBuilder.control('', Validators.required));
        break;
      case 'Dipendente':
        userDetailsForm.addControl('role', this._formBuilder.control('', Validators.required));
        userDetailsForm.addControl('reference', this._formBuilder.control('', Validators.required));
        break;
      case 'Utilizzatore':
        userDetailsForm.addControl('reference', this._formBuilder.control('', Validators.required));
        break;
    }
    this.form.setControl('step5', userDetailsForm);
  }

  resetForm(): void {
    this.initForm();
    this.stepper.reset();
    this.showPersonalDataDetails = false;
    this.showCompanyDataDetails = false;
  }

  onSubmit() {
    console.log('form', this.form)
  }
}